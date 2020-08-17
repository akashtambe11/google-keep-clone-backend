const router = require('express').Router();
const userController = require('../controllers/userController');
const authentication = require('../auth/auth');
const labelController = require('../controllers/labelController');

//user
router.post('/register', userController.register);
router.post('/verify/:shortenUrl', authentication.verificationToken, userController.verifyMail);
router.post('/login', userController.login);
router.post('/forgot', userController.forgot);
router.post('/reset/:token', authentication.resetToken, userController.reset);

//note

//label
router.post('/label/add', authentication.loginToken, labelController.addLabel);

module.exports = router;