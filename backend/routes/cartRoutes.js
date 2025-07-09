import express from 'express'
import { addTocart,updateCart,getUserCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'



const cartRouter=express.Router()

//joke


cartRouter.get('/get',authUser,getUserCart)
cartRouter.post('/add',authUser,addTocart)
cartRouter.post('/update',authUser,updateCart)


export default cartRouter;