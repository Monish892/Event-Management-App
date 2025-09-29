const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrCode: String,
  paymentStatus: String,
  paymentId: String,
  amount: Number
}, { timestamps: true })

module.exports = mongoose.model('Ticket', ticketSchema)
