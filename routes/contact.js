  
import express from 'express'
import { contactId, Create,Delete,Read,List } from '../controller/contact';
import { requireSignin, isAuth,isAdmin } from '../controller/auth'
import { userById } from '../controller/user'
const router = express.Router();

router.post('/contact',Create);
router.get('/contact/:contactId',Read);
router.delete('/contact/:contactId/:userId',requireSignin,isAuth,isAdmin,Delete);
router.param('contactId',contactId);
router.get('/contact',List);
router.param('userId',userById)
module.exports = router;