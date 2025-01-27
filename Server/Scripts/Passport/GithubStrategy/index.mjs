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
    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.statusText}`);
    }

    const emails = await response.json(); // Parse the body as JSON

    console.log('Emails:', emails);

    // Retrieve the primary email
    const primaryEmail = emails.find((email) => email.primary)?.email || 'No primary email found';
    console.log('Primary Email:', primaryEmail);

    return primaryEmail;
};

passport.use(new GithubStrategy({
    clientID:process.env.GTCID,
    clientSecret: process.env.GTCSECRET,
    callbackURL: "http://localhost:8000/auth/callback/github",
    passReqToCallback:true,
    scope:['user:email']
  },
 async function(request,accessToken, refreshToken, profile, cb) {
    let user=await User.findOne({ userId: profile.id });
    if(!user){
        // GitHub emails can be private, so fetch emails explicitly if null
        const email = profile._json.email || (await fetchGitHubEmails(accessToken));
       user=await User.create({userId:profile.id,userName:profile._json.name,email:email,userImage:profile._json.avatar_url,password:profile.id,provider:"Github"});
       return cb(null, user);
    }
    else
    {

        return cb(null, user);
    }
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