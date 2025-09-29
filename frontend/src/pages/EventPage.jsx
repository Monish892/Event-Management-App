import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'
import './EventPage.css'

export default function EventPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${eventId}`)
        setEvent(data)
      } catch (err) {
        console.error('Fetch Event Error:', err)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    if (eventId) fetchEvent()
  }, [eventId])

  const handlePayment = async () => {
    if (!event) return
    setPurchasing(true)
    try {
      const token = localStorage.getItem('token')
      const { data } = await API.post(
        `/tickets/purchase/${event._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RLKbZ9VkEH6dX4',
        amount: data.amount,
        currency: data.currency,
        name: event.name,
        description: 'Event Ticket',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const ticketRes = await API.post(
              `/tickets/confirm/${event._id}`,
              { razorpay_payment_id: response.razorpay_payment_id },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Payment successful! Ticket booked.')
            navigate(`/ticket/${ticketRes.data._id}`)
          } catch (err) {
            console.error('Ticket Confirmation Error:', err)
            alert('Payment succeeded, but ticket could not be confirmed.')
          }
        },
        prefill: {
          email: localStorage.getItem('userEmail') || ''
        },
        theme: { color: '#3399cc' }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error)
        alert('Payment failed. Please try again.')
      })

      rzp.open()
    } catch (err) {
      console.error('Purchase Error:', err.response || err)
      alert(err.response?.data?.message || 'Payment failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="event-loading">Loading event...</div>
  if (!event) return <div className="event-not-found">Event not found</div>

  return (
    <div className="event-page-container">
      <div className="event-card">
        <div className="event-hero">
          <h1 className="event-title">{event.name}</h1>
        </div>
        <div className="event-content">
          <div className="event-details">
            <div className="event-detail-item">
              <div className="event-detail-label">Date</div>
              <div className="event-detail-value">{new Date(event.date).toLocaleString()}</div>
            </div>
            <div className="event-detail-item">
              <div className="event-detail-label">Location</div>
              <div className="event-detail-value">{event.location}</div>
            </div>
            <div className="event-detail-item">
              <div className="event-detail-label">Price</div>
              <div className="event-price">{event.price}</div>
            </div>
          </div>
          <div className="buy-ticket-section">
            <button
              className={`buy-ticket-btn ${purchasing ? 'processing' : ''}`}
              onClick={handlePayment}
              disabled={purchasing}
            >
              {purchasing ? 'Processing...' : 'Buy Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
