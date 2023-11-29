const mongoose = require('mongoose')
const Router = require('express').Router()

const userSchema = require('../models/User')
const messageSchema = require('../models/Message')
const chatSchema = require('../models/Chat')

const authMiddleware = require('../middleware/authMiddleware')

// All user routes start with /users

/* --------------------------------- Routes --------------------------------- */

Router.get('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  
  await userSchema
    .findById(userId)
    .then(user => {
      res.json({ user })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Contacts Error`)
      return next(err.message)
    })
})


Router.get('/:userId/contacts', async (req, res, next) => {
  const userId = req.params.userId
  
  await userSchema
    .find({ _id: {$ne: userId} }, '_id username')
    .then(users => {
      res.json({ users })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Contacts Error`)
      return next(err.message)
    })
})

Router.get('/messages/:chatId', async (req, res, next) => {
  const chatId = req.params.chatId
  
  await messageSchema
    .find({ chatId: chatId })
    .then(messages => {
      res.json({ messages  })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Get messages Error`)
      return next(err.message)
    })
})


Router.post('/message', async (req, res, next) => {
  if (!req.body.message) return res.json({
    Error: "Needed text for message"
  })
  await messageSchema
    .create(req.body)
    .then(message => {
      res.json({ message })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Post message Error`)
      return next(err.message)
    })
})

Router.post('/:userId/chat', async (req, res, next) => {
  let userId = req.params.userId
  let { name, type, members } = req.body

  let chatName = ""
  if (name) {
    chatName = name
  }

  await chatSchema
    .create({
      name: chatName,
      members: [userId, ...members],
      type: type
    })
    .then(chat => {
      res.json({ chat })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Post chat Error`)
      return next(err.message)
    })
})

Router.get('/:userId/chat/:chatType', async (req, res, next) => {
  let { userId, chatType } = req.params
  let { name, type, members } = req.body

  await chatSchema
    .find({
      type: chatType,
      members: { $in: [userId]}
    })
    .then(chats => {
      res.json({ chats })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Get chat Error`)
      return next(err.message)
    })
})

Router.get('/chat/:firstUserId/:secondUserId', async (req, res, next) => {
  let { firstUserId, secondUserId } = req.params

  await chatSchema
    .findOne({
      type: 'private',
      members: { $all: [firstUserId, secondUserId]}
    })
    .then(chat => {
      res.json({ chat })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Get chat Error`)
      return next(err.message)
    })
})

Router.get('/chat/:roomId', async (req, res, next) => {
  let roomId = req.params.roomId
  
  await chatSchema
    .findById(roomId)
    .then(chat => {
      res.json({ chat })
    })
    .catch(err => {
      res.json({
        Error: err
      })
      console.log(`Get chat Error`)
      return next(err.message)
    })
})

module.exports = Router





