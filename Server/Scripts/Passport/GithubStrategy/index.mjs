import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import User from '../../Model/User_Model/index.mjs';
import dotenv from 'dotenv';
dotenv.config();

// Helper function to fetch emails if they are private
async function fetchGitHubEmails(accessToken) {
      const response = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        
      }}
    )
    console.log(response);
};

passport.use(new GithubStrategy({
    clientID:process.env.GTCID,
    clientSecret: process.env.GTCSECRET,
    callbackURL: "http://localhost:8000/auth/callback/github",
    passReqToCallback:true,
    scope:['user:email']
  },
 async function(request,accessToken, refreshToken, profile, cb) {
    // const user=User.findOne({ userId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    let user=await User.findOne({ userId: profile.id });
    if(!user){
        // GitHub emails can be private, so fetch emails explicitly if null
        const email = profile._json.email || (await fetchGitHubEmails(accessToken));
       user=await User.create({userId:profile.id,userName:profile._json.name,email:email,userImage:profile._json.avatar_url,password:profile.id});
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