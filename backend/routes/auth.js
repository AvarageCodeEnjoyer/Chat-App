const mongoose = require('mongoose')
const Router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = require('../models/User')
const MessageSchema = require('../models/Message')
const chatSchema = require('../models/Chat')

const authMiddleware = require('../middleware/authMiddleware')

const { SECRET_KEY } = process.env

// All user routes start with /users

/* --------------------------------- Routes --------------------------------- */

Router.post('/register', async (req, res, next) => {
  req.body.password = await bcrypt(req.body.password, 10)

  await userSchema 
    .create(req.body)
    .then(newUser => {
      const payload = { userId: newUser._id, username: newUser.username }
      let token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1d",
      })

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false
      })

      res.json({
        user: newUser
      })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Register Error`)
      return next(err.message)
    })
  res.send('register')
})


Router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  
  await userSchema
    .findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Incorrect username or password'
        })
      }

      const passwordCorrect = bcrypt.compareSync(password, user.password)

      if (!passwordCorrect) {
        return res.status(401).json({
          message: 'Incorrect username or password'
        })
      }

      const payload = { userId: user._id, username: user.username}

      let token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1d'
      })

      res.cookie('token', token, {
        withCredentials: true,
        httpOnly: false 
      })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`login Error`)
      return next(err.message)
    })
  res.send('login')
})

Router.post('/logout', async (req, res, next) => {
  res.send('logout')
})



module.exports = Router