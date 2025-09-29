import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import './Dasboard.css' // Add this import

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem('token')
        const res = await API.get('/tickets/mine', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTickets(res.data)
        setError('')
      } catch (err) {
        console.error('Failed to fetch tickets', err)
        setError(err.response?.data?.message || 'Failed to fetch tickets')
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  if (loading) return <div className="dashboard-loading">Loading your tickets...</div>
  if (error) return <div className="dashboard-error">{error}</div>
  if (tickets.length === 0) return <div className="dashboard-empty">No tickets found</div>

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🎫 My Tickets</h2>
      <ul className="tickets-list">
        {tickets.map(t => (
          <li key={t._id} className="ticket-card">
            <div className="ticket-info">
              <div className="ticket-detail">
                <span className="ticket-label">Event:</span>
                <span className="ticket-value">{t.event?.name || 'N/A'}</span>
              </div>
              <div className="ticket-detail">
                <span className="ticket-label">Date:</span>
                <span className="ticket-value">{t.event?.date ? new Date(t.event.date).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="ticket-detail">
                <span className="ticket-label">Amount Paid:</span>
                <span className="ticket-value">₹{t.amount || 0}</span>
              </div>
              <div className="ticket-detail">
                <span className="ticket-label">Payment Status:</span>
                <span className={`ticket-value payment-status ${(t.paymentStatus || '').toLowerCase()}`}>
                  {t.paymentStatus || 'N/A'}
                </span>
              </div>
            </div>
            <div className="ticket-qr">
              {t.qrCode ? (
                <Link className="qr-link" to={`/ticket/${t._id}`}>
                  <img className="qr-image" src={t.qrCode} alt="Ticket QR Code" />
                </Link>
              ) : (
                <span className="no-qr">No QR</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}