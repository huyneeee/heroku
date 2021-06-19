import express from 'express';
import { isAdmin, isAuth, requireSignin } from '../controller/auth';
import { countOrder, Create, List, orderByStatus, orderByUser, orderId, orderRecent, Read, totalOrderInMonth6, update } from '../controller/order';
import { userById } from '../controller/user';
const router = express.Router();
router.post('/order/:userId',requireSignin,Create);

router.get('/order/:orderId',Read);

// router.delete('/order/:orderId',Delete);

router.param('orderId',orderId);

router.get('/countorder',countOrder);

router.get('/order',List); 

router.put('/order/:orderId/:userId',requireSignin,isAuth,isAdmin,update);

router.param('userId',userById);

router.get('/orderrecent',orderRecent);

router.post('/orderByUser',orderByUser);

router.get('/totalOrderInMonth6',totalOrderInMonth6);
 
router.post('/orderbystutus',orderByStatus)
module.exports = router; 