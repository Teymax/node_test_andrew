const { ExtractJwt, Strategy } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
import { user as User } from '../models';
const { JWT_ENCRYPTION } = process.env;
const { to } = require('../utils/requestHelpers');

require('dotenv').config();
const { GOOGLE_CLIENT_ID } = process.env;
const { GOOGLE_CLIENT_SECRET } = process.env;
const { FACEBOOK_CLIENT_ID } = process.env;
const { FACEBOOK_CLIENT_SECRET } = process.env;
const { OAUTH_REDIRECT_URL } = process.env;

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = JWT_ENCRYPTION;

  passport.use(new Strategy(opts, async function (jwt_payload, done) {
    let err, user;
    [err, user] = await to(User.findOne({where: {email: jwt_payload.user_email} }));
    if (err) return done(err, false);
    if (user) {
      return done(null, user);
    }else{
      return done(null, false);
    }
  }));


  passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: OAUTH_REDIRECT_URL + "/googleRedirect"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
        return done(null, profile)
      }
  ))

  passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: OAUTH_REDIRECT_URL + "/facebookRedirect",
        profileFields: ['id', 'displayName', 'email', 'picture']
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        console.log("FACEBOOK BASED OAUTH VALIDATION GETTING CALLED")
        return done(null, profile)
      }));

    // These functions are required for getting data To/from JSON returned from Providers
    passport.serializeUser(function(user, done) {
        done(null, user)
    })
    passport.deserializeUser(function(obj, done) {
        done(null, obj)
    })
};

