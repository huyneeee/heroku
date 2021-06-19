const User = require('../model/user');
import jwt from 'jsonwebtoken';
const expressJwt = require('express-jwt');
import dotenv from 'dotenv';
const sgMail = require('@sendgrid/mail')
const nodemailer = require("nodemailer");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
dotenv.config();


export const signup = (req, res) => {
    const {name , email , hashed_password} = new User(req.body);

    // const user = new User(req.body)
    // user.save((err, user) => {
    User.findOne({ email }).exec(async (err, user) => {

        if (user) {
            res.status(400).json({
                error: "Cannot register user !"
            })
        }
        
        let token = jwt.sign({  email, hashed_password,name }, process.env.JWT_ACTIVATEACCOUNT, { expiresIn: '10m' });

        let msg = {
            to: email, // Change to your recipient
            from: process.env.EMAIL_FROM, // Change to your verified sender
            subject: 'WELCOME TO MOEW MOEW SHOP!',
            text:'okioki',
            html: `<b>Welcome to MOEW MOEW SHOP </> <br>
                <b>HI ${name}<b> </br>
                <b>Please use the following link to activate your account</b> </br>
                <a href="${process.env.CLIENT_URL}/auth/activate/${token}" >Click!</a>
            `,
        }
        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
            })
            .catch((error) => {
                console.error(error)
            })
        //test send mail
        res.json({
            message:"Vui lòng kiểm tra email của bạn để kích hoạt tài khoản !"
        })
    })

}
export const signin = (req, res) => {

    //find the user base on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {

        if (err || !user) {
            return res.status(400).json({
                email: 'email',
                error: "User with that email does not exist . Please signup!"
            })
        }

        //if user is found make sure email and passowrd hash
        //creat authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(200).json({
                password: 'password',
                error: "Email and password not match"
            })
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // persist the token as 't' in cookie with
        res.cookie('userSignIn', token, { expire: new Date() + 9999 });
        //send mail


        //return res with user and token to fronend client
        const { _id, name, email, role } = user;
        return res.json({
            token, user: { _id, name, email, role }
        })
    })
}
export const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
})
export const signout = (req, res) => {
    res.clearCookie('userSignIn');
    res.json({
        message: "SignOut "
    })
}
export const isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({
            error: "Bạn không phải là Admin !"
        })
    }
    next();
}
export const isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Bạn không phải là nhân viên !"
        })
    }
    next();
}
export const activated = (req, res) => {
  
    const  token  = req.body.token; 
 
    if (token) {
        jwt.verify(token, process.env.JWT_ACTIVATEACCOUNT, function (err, decode) {
            if (err) {
                console.log('Lỗi token', err);
                return res.status(400).json({
                    error: "Expired link. Signup again"
                })
            }
            const { name, email, hashed_password } = jwt.decode(token);
            const user = new User({ name, email, hashed_password });
            user.save((error, user) => {
                if (error) {
                    return res.status(400).json({
                        error: "Không thể đăng ký tài khoản"
                    })
                }
                user.salt = undefined
                user.hashed_password = undefined
                res.json({ user })
            })
        })
    }
}