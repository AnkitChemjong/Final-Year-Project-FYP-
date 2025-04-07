import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../../Model/User_Model/index.mjs';

dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FCID,
      clientSecret: process.env.FCS,
      callbackURL: "http://localhost:8000/auth/callback/facebook",
      passReqToCallback: true,
      profileFields: ['id', 'displayName', 'photos', 'email'], // Explicitly request email
      scope: ['email'], // Request email permission
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error("Email not provided by Facebook. Please ensure your Facebook account has a verified email."), null);
        }

        let user = await User.findOne({ userId: profile.id });

        if (!user) {
          user = await User.create({
            userId: profile.id,
            userName: profile.displayName || 'Facebook User',
            email, // Now guaranteed to have a value (or error thrown)
            userImage: profile.photos?.[0]?.value || null,
            password: profile.id,
            provider: "Facebook"
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in Facebook strategy:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ userId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
