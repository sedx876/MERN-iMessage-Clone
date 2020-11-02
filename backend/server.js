//import
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'


//app config
const app = express()
const port = process.env.PORT || 9000

//middleware
app.use(cors())
app.use(express.json())

//db config


//api routes


//listeners
app.listen(port, () => console.log(`listening on localhost:${port}`))