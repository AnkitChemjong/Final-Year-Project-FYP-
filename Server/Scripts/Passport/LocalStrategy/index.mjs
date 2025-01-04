import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import User from "../../Model/User_Model/index.mjs";

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email:email });
        //console.log(user);
        if (!user) {
          return done(null, false, { message: 'User is not avilable.',status:401});
        }
  
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.',status:402});
        }
  
        return done(null, user,{message:"Loged in successfully",status:200});
      } catch (error) {
        return done(err,null,{message:"Error in login",status:500});
      }
    }
  ));


  // Serialize user instance to the session
passport.serializeUser((user, done) => {
    done(null, user.userId);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({userId: id});
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});