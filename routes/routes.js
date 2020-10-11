// imports
const router = require('express').Router();
const userController = require('../controllers/userController');
const authentication = require('../auth/auth');
const labelController = require('../controllers/labelController');
const noteController = require('../controllers/noteController');

// user
router.post('/register', userController.register);
router.post('/verify/:shortenUrl', authentication.verificationToken, userController.verifyMail);
router.post('/login', userController.login);
router.post('/forgot', userController.forgot);
router.post('/reset/:token', authentication.resetToken, userController.reset);

// note
router.post('/note/addNote', authentication.loginToken, noteController.addNote);
router.put('/note/updateNote', authentication.loginToken, noteController.updateNote);
router.post('/note/searchNote', authentication.loginToken, noteController.searchNotes);
router.delete('/note/deleteNote', authentication.loginToken, noteController.deleteNote);
router.get('/note/getAllNotes', authentication.loginToken, noteController.getAllNotes);

// label
router.post('/label/addLabel', authentication.loginToken, labelController.addLabel);
router.put('/label/updateLabel', authentication.loginToken, labelController.updateLabel);
router.delete('/label/deleteLabel', authentication.loginToken, labelController.deleteLabel);
router.get('/label/getAllLabels', authentication.loginToken, labelController.getAllLabels);

module.exports = router;