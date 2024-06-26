const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    bookName:{
        type: String
    },
    bookPrice:{
        type: Number
    }
})

const Book = mongoose.model('book',bookSchema)
module.exports = Book