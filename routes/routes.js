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
router.post('/label/addLabel', authentication.loginToken, labelController.addLabel);
router.post('/label/updateLabel', authentication.loginToken, labelController.updateLabel);
router.post('/label/deleteLabel', authentication.loginToken, labelController.deleteLabel);

module.exports = router;