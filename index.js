const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const uploadRoutes = require('./routes/upload.routes.js')
const filterRoutes = require('./routes/filter.routes.js')
require('dotenv').config()


const server = express()
server.use(express.json())
server.use(cors())

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected ✅");
})
.catch((e)=>{
    console.error("error: " + e);
})

server.use('/upload', uploadRoutes)
server.use('/filter', filterRoutes)

server.listen(3000, () => console.log("The server is running on http://localhost:3000"))