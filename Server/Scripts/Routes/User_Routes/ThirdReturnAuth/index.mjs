import { Router } from "express";
import passport from "passport";

const authRoute=Router();

authRoute.get('/auth/callback/google',passport.authenticate('google',{ failureRedirect: process.env.FAILURE_URL }),(req,res)=>{
    res.redirect(process.env.FRONTEND_URL);
});
authRoute.get('/auth/callback/github',passport.authenticate('github',{ failureRedirect: process.env.FAILURE_URL }),(req,res)=>{
    res.redirect(process.env.FRONTEND_URL);
});
authRoute.get('/auth/callback/facebook',passport.authenticate('facebook',{ failureRedirect: process.env.FAILURE_URL }),(req,res)=>{
    res.redirect(process.env.FRONTEND_URL);
});

export default authRoute;
