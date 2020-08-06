const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../auth/auth');

router.post('/register', userController.register);
router.post('/verify/:shortenUrl', auth.verificationToken, userController.verifyMail);
router.post('/login', userController.login);

module.exports = router;