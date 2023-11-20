const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const mongoose = require('mongoose')
require('dotenv/config')
const path = require('path')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use('/', router)

const dbOptions = {useNewUrlParser:true, useUnifiedTopology:true}
mongoose.connect(process.env.DB_URI, dbOptions)
.then(() => console.log('DB connected!'))
.catch(err => console.log(err))

//hello

//production
app.use(express.static('./frontend/build'))
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Hii, server running on ${port}`);
});