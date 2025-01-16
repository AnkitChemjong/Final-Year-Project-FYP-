import { Router } from "express";
import { createUser } from "../../Controllers/User_Controller/CreateUser/index.mjs";
import getLogedUser from "../../Controllers/User_Controller/GetLogedUser/index.mjs";
import logoutUser from "../../Controllers/User_Controller/LogoutUser/index.mjs";
import passport from "passport";
import GenCode from "../../Controllers/User_Controller/GenCode/index.mjs";
import CheckCode from "../../Controllers/User_Controller/CheckCode/index.mjs";
import ChangePassword from "../../Controllers/User_Controller/ChangePassword/index.mjs";


const userRoute=Router();

userRoute.route('/').post(createUser).get(getLogedUser).delete(logoutUser);


userRoute.post('/code',GenCode);
userRoute.post('/check',CheckCode);
userRoute.patch('/changePass',ChangePassword)
userRoute.post('/log', passport.authenticate('local'),(req,res)=>{
    res.status(200).json({message:"logedin successfully",user:req.user});
});
userRoute.get('/auth/google',passport.authenticate('google'))
userRoute.get('/auth/github',passport.authenticate('github'))
userRoute.get('/auth/facebook',passport.authenticate('facebook'))
  

export default userRoute;