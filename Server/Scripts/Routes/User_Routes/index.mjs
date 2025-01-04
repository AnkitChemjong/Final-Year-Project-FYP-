import { Router } from "express";
import { createUser } from "../../Controllers/User_Controller/CreateUser/index.mjs";
import getLogedUser from "../../Controllers/User_Controller/GetLogedUser/index.mjs";
import logoutUser from "../../Controllers/User_Controller/LogoutUser/index.mjs";
import passport from "passport";


const userRoute=Router();

userRoute.route('/').post(createUser).get(getLogedUser).delete(logoutUser);

userRoute.post('/log', passport.authenticate('local'),(req,res)=>{
    res.status(200).json({message:"logedin successfully"})
});
userRoute.get('/auth/google',passport.authenticate('google'))
userRoute.get('/auth/github',passport.authenticate('github'))
userRoute.get('/auth/facebook',passport.authenticate('facebook'))
  

export default userRoute;