//import
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'
import mongoData from './mongoData.js'


//app config
const app = express()
const port = process.env.PORT || 9000


const pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: '',
  encrypted: true
});

//middleware
app.use(cors())
app.use(express.json())

//db config
const mongoURI = 'mongodb+srv://admin:Mw2ItPlUKn6ycZu3@cluster0.nehlk.mongodb.net/imessageDB?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
  console.log('DB Connected')

  const changeStream = mongoose.connection.collection('conversations').watch()

  changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
          pusher.trigger('chats', 'newChat', {
              'change': change
          })
      } else if (change.operationType === 'update') {
          pusher.trigger('messages', 'newMessage', {
              'change': change
          })
      } else {
          console.log('Error triggering Pusher...')
      }
  })
})

//api routes
app.get('/', (req, res) => res.status(200).send('Hello Moto'))

app.post('/new/conversation', (req, res) => {
  const dbData = req.body

  mongoData.create(dbData, (err, data) => {
      if (err) {
          res.status(500).send(err)
      } else {
          res.status(201).send(data)
      }
  })
})

app.post('/new/message', (req, res) => {
  mongoData.update(
      { _id: req.query.id },
      { $push: { conversation: req.body } },
      (err, data) => {
          if (err) {
              console.log('Error saving message...')
              console.log(err)

              res.status(500).send(err)
          } else {
              res.status(201).send(data)
          }
      }
  )
})

app.get('/get/conversationList', (req, res) => {
  mongoData.find((err, data) => {
      if (err) {
          res.status(500).send(err)
      } else {
          data.sort((b, a) => {
              return a.timestamp - b.timestamp;
          });

          let conversations = []

          data.map((conversationData) => {
              const conversationInfo = {
                  id: conversationData._id,
                  name: conversationData.chatName,
                  timestamp: conversationData.conversation[0].timestamp
              }

              conversations.push(conversationInfo)
          })

          res.status(200).send(conversations)
      }
  })
})

app.get('/get/conversation', (req, res) => {
  const id = req.query.id

  mongoData.find({ _id: id }, (err, data) => {
      if (err) {
          res.status(500).send(err)
      } else {
          res.status(200).send(data)
      }
  })
})

app.get('/get/lastMessage', (req, res) => {
  const id = req.query.id

  mongoData.find({ _id: id }, (err, data) => {
      if (err) {
          res.status(500).send(err)
      } else {
          let convData = data[0].conversation

          convData.sort((b, a) => {
              return a.timestamp - b.timestamp;
          });

          res.status(200).send(convData[0])
      }
  })
})


//listeners
app.listen(port, () => console.log(`listening on localhost:${port}`))