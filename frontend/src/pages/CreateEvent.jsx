import React, { useState } from 'react'
import API from '../api'
import './CreateEvent.css'

export default function CreateEvent() {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', price: 0 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await API.post('/events', form)
    alert('Event created!')
  }

  return (
    <form className="create-event-form" onSubmit={handleSubmit}>
      <input
        className="create-event-input"
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        className="create-event-input"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="create-event-input"
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />
      <input
        className="create-event-input"
        placeholder="Location"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />
      <input
        className="create-event-input"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />
      <button type="submit" className="create-event-submit">Create</button>
    </form>
  )
}
