import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import './Home.css'

export default function Home() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    API.get('/events').then(res => setEvents(res.data))
  }, [])

  return (
    <div className="events-container">
      <h2 className="events-title">Upcoming Events</h2>
      <ul className="events-list">
        {events.map(ev => (
          <li key={ev._id} className="event-card">
            <Link to={`/event/${ev._id}`} className="event-link">{ev.title}</Link> – <span className="event-date">{ev.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}