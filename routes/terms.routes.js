import express from 'express';
const router = express.Router();
const UserController = require('../controllers/user.controller');
const TermsController = require('../controllers/terms.controller');
const passport = require('passport');
require('../middleware/passport')(passport);

router.post('/register', UserController.create);
router.post('/accept', passport.authenticate('jwt', {session:false}), TermsController.accept)

module.exports = router;
