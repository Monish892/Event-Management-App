require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const ticketRoutes = require('./routes/tickets')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Event Management API running'))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/tickets', ticketRoutes)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1) // stop the app if DB connection fails
  })
