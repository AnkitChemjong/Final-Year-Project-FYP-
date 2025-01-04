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
      profileFields: ['id', 'displayName', 'photos', 'email'], // Request email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value; // Access email
        console.log(email);
        let user = await User.findOne({ userId: profile.id });

        if (!user) {
          user = await User.create({
            userId: profile.id,
            userName: profile.displayName || 'Facebook User',
            email,
            userImage: profile.photos?.[0]?.value || null,
            password: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in Facebook strategy:", err);
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
