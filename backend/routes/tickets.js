const express = require('express')
const QRCode = require('qrcode')
const Ticket = require('../models/Ticket')
const Event = require('../models/Event')
const auth = require('../middleware/auth')

// Razorpay setup
const Razorpay = require('razorpay')
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const router = express.Router()

// PURCHASE: create Razorpay order
router.post('/purchase/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const receiptId = `r_${event._id.toString().slice(-6)}_${req.user.id.toString().slice(-6)}`

    const options = {
      amount: Math.round(event.price * 100), // in paise
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1
    }

    const order = await razorpay.orders.create(options)
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error('Purchase Error:', err)
    res.status(500).json({ message: 'Error creating Razorpay order', error: err.message })
  }
})

// CONFIRM: mark ticket as paid and generate QR
router.post('/confirm/:eventId', auth, async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body
    if (!razorpay_payment_id)
      return res.status(400).json({ message: 'Missing Razorpay payment ID' })

    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    // Create ticket with correct ObjectId references
    const ticket = new Ticket({
      event: event._id,
      user: req.user.id,
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      amount: event.price
    })
    await ticket.save()

    // Generate QR code pointing to TicketPage URL
 const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/ticket/${ticket._id}`
const qr = await QRCode.toDataURL(qrUrl)
ticket.qrCode = qr
await ticket.save()


    res.json(ticket)
  } catch (err) {
    console.error('Confirm Ticket Error:', err)
    res.status(500).json({ message: 'Error confirming ticket', error: err.message })
  }
})

// DASHBOARD: get all tickets of logged-in user
router.get('/mine', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event')
      .populate('user', 'name email')
    res.json(tickets)
  } catch (err) {
    console.error('Get My Tickets Error:', err)
    res.status(500).json({ message: 'Error fetching tickets', error: err.message })
  }
})

// TICKET PAGE: get ticket by ID
router.get('/:ticketId', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('event')
      .populate('user', 'name email')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    res.json(ticket)
  } catch (err) {
    console.error('Get Ticket Error:', err)
    res.status(500).json({ message: 'Error fetching ticket', error: err.message })
  }
})

module.exports = router
