import express from 'express'

import {  Create , Read ,CategoryId,Update ,Delete,List ,Image, countCategory, countProductOfCategory } from '../controller/category'
import {userById} from '../controller/user'
import { requireSignin , isAuth , isAdmin } from '../controller/auth'
const router = express.Router();



router.post('/category/:userById',requireSignin,isAuth,isAdmin,Create);

router.get('/category',List);

router.get('/category/:categoryId',Read);

router.put('/category/:categoryId/:userById',requireSignin,isAuth,isAdmin,Update);

router.delete('/category/:categoryId/:userById',requireSignin,isAuth,isAdmin,Delete);

router.param('categoryId',CategoryId);

router.get('/category/image/:categoryId', Image);

router.param('userById',userById);

router.get('/countProductOfCategory',countProductOfCategory);

router.get('/countCategory', countCategory);

module.exports = router; 