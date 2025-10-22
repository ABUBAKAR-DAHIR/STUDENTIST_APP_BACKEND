const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    university: {type: String, require: true},
    year: {type: String, require: true},
    semester: {type: String, require: true},
    faculty: {type: String, require: true},
    subject: {type: String, require: true},
    fileName: {type: String, require: true},
    fileUrl: {type: String, require: true}
}, {timestamps: true})
 
let Note = mongoose.model('Note', fileSchema)
module.exports = Note