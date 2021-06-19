import mongoose from 'mongoose'
const { ObjectId } =  mongoose.Schema;
const orderDetailSchema = new mongoose.Schema({
    id_product : {
        type : ObjectId,
        ref : "Product",
        required : true
    },
    name : {
        type : String,
        trim : true,
        maxLength : 32,
        required : true,
    },
    price : {
        type : Number,
        trim : true,
        required : true,
    },
    category : {
        type : ObjectId,
        ref : "Category",
        required : true
    },
    sl : {
        type : Number,
        trim : true,
        required : true,
        maxLength : 32
    },
    id_order : {
        type : ObjectId,
        ref : "Order",
        required : true
    }

},{timestamps : true})
module.exports = mongoose.model ("OrderDetail",orderDetailSchema);