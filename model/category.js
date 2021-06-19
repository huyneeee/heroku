import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true,
        required : true,
        maxLength : 32
    },
    description : {
        type : String ,
        trim : true ,
        required : true ,
        maxLength : 255
    },
    image : {
        data: Buffer,
        contentType: String
    }
},{timestamps : true})
module.exports = mongoose.model ("Category",categorySchema);