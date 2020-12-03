import express from 'express';
const router = express.Router();
const UserController = require('../controllers/user.controller');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('../middleware/passport')(passport);

router.post('/register', UserController.create);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.put('/updateUser', passport.authenticate('jwt', {session:false}), UserController.update)
router.get('/isUsernameAvalaible', UserController.isAvalaible);

// OAuth Authentication, Just going to this URL will open OAuth screens
router.get('/login/google',  passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/login/facebook',  passport.authenticate('facebook', {scope:'email'}));
// Oauth user data comes to these redirectURLs
router.get('/googleRedirect', passport.authenticate('google'), UserController.loginGoogle);
router.get('/facebookRedirect', passport.authenticate('facebook', {scope: 'email'}), UserController.loginFacebook);

module.exports = router;
