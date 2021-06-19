import express from 'express'
import { requireSignin } from '../controller/auth';
import { Create , List, OrderDetailByOrderId, Read} from '../controller/orderDetail';

import { userById } from '../controller/user'

const router = express.Router();

router.post('/orderdetail/:userId',requireSignin,Create);

router.get('/orderdetail',List);

router.get('/orderdetail/:OrderDetailByOrderId',Read);

router.param('OrderDetailByOrderId',OrderDetailByOrderId);

router.param('userId',userById)

module.exports = router;