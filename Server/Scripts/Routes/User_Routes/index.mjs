import { Router } from "express";
import { createUser } from "../../Controllers/User_Controller/CreateUser/index.mjs";
import getLogedUser from "../../Controllers/User_Controller/GetLogedUser/index.mjs";
import passport from "passport";

const userRoute=Router();

userRoute.route('/').post(createUser).get(getLogedUser);

userRoute.post('/log',passport.authenticate('local'),(req,res)=>{
    return res.json({user:req.user,message:"Loged in Successfully"});
})

export default userRoute;