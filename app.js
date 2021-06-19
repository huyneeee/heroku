import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productsRouter from './routes/product';
import categoryRouter from './routes/category';
import blogRouter from './routes/blog';
import commentRouter from './routes/comment';
import contactRouter from './routes/contact';
import orderRouter from './routes/order';
import orderDetailRouter from './routes/orderDetail';
const authRouter = require('./routes/auth');
import userRouter from './routes/user';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
const sgMail = require('@sendgrid/mail')
const app = express();
dotenv.config();

//connection
mongoose.connect(process.env.MOONGODB_URI , {
  useNewUrlParser: true,
  useCreateIndex: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('db connectioned');
})
mongoose.connection.on('error', (err) => {
  console.log('lôi');
})
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const msg = {
  to: 'huynqph10119@fpt.edu.vn', // Change to your recipient
  from: process.env.EMAIL_FROM, // Change to your verified sender
  subject: 'Đặt hàng thành công !',
  text:'oki',
  html: `<b>Cảm ơn bạn đã hàng !</b> <br>
  <b>Đơn hàng của bạn sẽ sớm được chúng tôi xác nhận !</b>
  `,
}
sgMail
  .send(msg) 
  .then((response) => {
    console.log(response[0].statusCode)
    console.log('gui mail oki')
  })
  .catch((error) => {
    console.error(error) 
  }) 
// middleware 
app.use(bodyParser.json()); 
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use('/api', productsRouter);
app.use('/api', categoryRouter);
app.use('/api', blogRouter);
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', commentRouter);
app.use('/api', contactRouter);
app.use('/api', orderRouter);
app.use('/api', orderDetailRouter);
// const port = process.env.PORT || 4000
const port = process.env.PORT || 4000
 
app.listen(port, () => {
  console.log('server is running',port);
})


// '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'
// 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
// oki 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
// MONGODB_URI = mongodb://localhost:27017/reactjs
// 171.251.238.7/32