import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../Model/User_Model/index.mjs';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID:process.env.GCID,
    clientSecret: process.env.GCSECRET,
    callbackURL: "http://localhost:8000/auth/callback/google",
    passReqToCallback:true,
    scope:['email','profile']
  },
 async function(request,accessToken, refreshToken, profile, cb) {
    let user=await User.findOne({ userId: profile.id });
    if(!user){
       user=await User.create({userId:profile.id,userName:profile._json.name,email:profile._json.email,userImage:profile._json.picture,password:profile.id});
       return cb(null, user);
    }
    else
    {

        return cb(null, user);
    }
    // console.log(profile.id)
    // console.log(profile._json.email)
    // console.log(profile._json.picture)
    // console.log(profile._json.name)
  }
));

// Serialize user instance to the session
passport.serializeUser((user, done) => {
    //console.log(user);
    done(null, user.userId);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ userId: id });
      done(null, user);
    } catch (err) {
      done(err,null);
    }
  });