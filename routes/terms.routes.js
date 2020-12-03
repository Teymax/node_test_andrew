import express from 'express';
const router = express.Router();
const TermsController = require('../controllers/terms.controller');
const passport = require('passport');
require('../middleware/passport')(passport);

router.get('/latest', passport.authenticate('jwt', {session:false}), TermsController.latest);
router.post('/accept', passport.authenticate('jwt', {session:false}), TermsController.accept);

module.exports = router;
