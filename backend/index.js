const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

/* -------------------------------- ENV data -------------------------------- */

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL

const initSocket = require('./socket/index')

const app = express()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

const authMiddleware = require('./middleware/authMiddleware')

const corsOptions = {
  origin: ['http://localhost:4000', 'http://localhost:5173'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  credentials: true,
  methods: ['GET', 'POST']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* --------------------------------- Routes --------------------------------- */

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

/* ---------------------------- Mongoose Connect ---------------------------- */

mongoose
  .connect(MONGO_URL)
  .then((x) => console.log(`Connected to ${x.connections[0]}`))
  .catch(err => console.log(`DB connection error: ${err.message}`))

app.post('/', authMiddleware)

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

initSocket(server, corsOptions)

