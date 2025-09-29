import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'

export default function TicketPage() {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTicket() {
      try {
        const token = localStorage.getItem('token')
        const { data } = await API.get(`/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTicket(data)
        setError('')
      } catch (err) {
        console.error('Get Ticket Error:', err)
        setTicket(null)
        setError(err.response?.data?.message || 'Failed to fetch ticket')
      } finally {
        setLoading(false)
      }
    }
    if (ticketId) fetchTicket()
  }, [ticketId])

  if (loading) return <div>Loading ticket...</div>
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
  if (!ticket) return <div>Ticket not found</div>

  const { event, user, qrCode, paymentStatus, amount, paymentId } = ticket

  return (
    <div style={{
      maxWidth: '450px',
      margin: '20px auto',
      padding: '25px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎟️ Your Ticket</h2>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Event:</strong> {event?.name || 'N/A'}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Date:</strong> {event?.date ? new Date(event.date).toLocaleString() : 'N/A'}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Location:</strong> {event?.location || 'N/A'}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Booked By:</strong> {user?.name || 'N/A'} ({user?.email || 'N/A'})
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Payment Status:</strong> {paymentStatus || 'N/A'}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Amount Paid:</strong> ₹{amount || 0}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Payment ID:</strong> {paymentId || 'N/A'}
      </div>

      {qrCode && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={qrCode} alt="Ticket QR Code" style={{ width: '220px', height: '220px' }} />
          <p style={{ marginTop: '8px' }}>Scan this QR at entry</p>
        </div>
      )}
    </div>
  )
}
