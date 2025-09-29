import React, { useState } from 'react'
import API from '../api'
import './Register.css' // import the CSS file

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await API.post('/auth/register', form)
      alert('Registered!')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create Account</h2>
      <input
        className="form-input"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="form-input"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button className="form-button" type="submit">Register</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  )
}
