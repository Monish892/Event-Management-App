const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password.trim(), 10)
    const user = new User({ name, email, password: password.trim(), hashedPassword, role })
    await user.save()
    res.json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message })
  }
})

// ...existing code...
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  console.log('Login attempt:', email, !!user)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, user.password)
  console.log('Password match:', isMatch)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.json({ token, user })
})

module.exports = router
