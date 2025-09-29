import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/create">Create Event</Link> | 
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}
