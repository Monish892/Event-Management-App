import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import EventPage from './pages/EventPage'
import CreateEvent from './pages/CreateEvent'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dasboard'
import TicketPage from './pages/TicketPage'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="event/:eventId" element={<EventPage />} />
        <Route path="create" element={<CreateEvent />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ticket/:ticketId" element={<TicketPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
