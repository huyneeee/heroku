import crypto from  'crypto';
import  mongoose  from 'mongoose';
const { v1 : uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true,
        maxLength : 32,
        required : true
    },
    email : {
        type : String ,
        trim : true,
        required : true,
        maxLength : 200
    },

    hashed_password : {
        type : String 
    }
    ,
    salt : {
        type : String
    },
    about : {
        type : String,
        default : 'An artist of considerable range, Jenna the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.'
    },
    role : {
        type : Number,
        default : 0
    },
    history : {
        type : Array,
        default : []
    },
    image : {
        type : String,
        default : 'https://cdn.iconscout.com/icon/free/png-512/laptop-user-1-1179329.png'
        
    }

},{timestamps : true})

userSchema.virtual('password')
    .set(function (password){
        this._password = password;

        this.salt = uuidv1();
        this.hashed_password = this.encrytPassword(password);
    })
    .get(function (){
        return this._password;
    })

userSchema.methods = {
    authenticate : function (plainText){
        return this.encrytPassword(plainText) === this.hashed_password;
    },
    encrytPassword : function (password){
        if(!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (error) {
            return "";
        }
    }
}


module.exports = mongoose.model("User",userSchema);