import mongoose from 'mongoose'
const blogSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true,
        required : true,
        maxLength : 200
    },
    content : {
        type : String ,
        trim : true ,
        required : true ,
        maxLength : 2000
    },
    image : {
        data: Buffer,
        contentType: String
    }
},{timestamps : true})
module.exports = mongoose.model ("Blog",blogSchema);