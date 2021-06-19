import express from 'express';
import { signup,signin, signout, activated } from '../controller/auth';
import {userSignupValidator} from '../validator';
const router = express.Router();

router.post('/signup',userSignupValidator,signup);
router.post('/auth/activate',activated);
router.post('/signin',signin); 
router.get('/signout',signout);
module.exports = router;
