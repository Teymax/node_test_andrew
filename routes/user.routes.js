import express from 'express';
const router = express.Router();
const UserController = require('../controllers/user.controller');
const passport = require('passport');
require('../middleware/passport')(passport);

router.post('/register', UserController.create);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.put('/updateUser', passport.authenticate('jwt', {session:false}), UserController.update)
module.exports = router;
