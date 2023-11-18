const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    id: {type:String},
    data: {type:Array},
    entrydate: {type:Date, default:Date.now}
})

const Image = mongoose.model('Image', imageSchema, 'image')
const mySchemas = {'Image':Image}

module.exports = mySchemas