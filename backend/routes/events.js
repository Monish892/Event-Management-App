const express = require('express')
const Event = require('../models/Event')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user.id })
    await event.save()
    res.json(event)
  } catch (err) {
    res.status(400).json({ message: 'Error creating event', error: err.message })
  }
})

router.get('/', async (req, res) => {
  const events = await Event.find().populate('organizer', 'name')
  res.json(events)
})

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name')
  res.json(event)
})

module.exports = router
