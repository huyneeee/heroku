import mongoose from 'mongoose'
const contactSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true,
        required : true,
        maxLength : 100
    },
    email : {
        type : String ,
        trim : true,
        maxLength : 32
    },
    phone : {
        type : Number,
        trim : true,
        maxLength: 11
    },
    massage : {
        type : String ,
        trim : true,
        maxLength : 500
    }
},{timestamps : true})
module.exports = mongoose.model ("Contact",contactSchema);