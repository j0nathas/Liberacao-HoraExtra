const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const userRoutes      = require('./routes/user.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

app.use('/api/users', userRoutes)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use(errorMiddleware)

module.exports = app
