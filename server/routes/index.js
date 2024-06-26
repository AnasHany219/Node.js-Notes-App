const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

/**
 * App Routes
 */
router.get('/', mainController.homePage);
router.get('/about', mainController.about);

router.get('/login', mainController.login);
router.post('/login', mainController.userLogin);

router.get('/signup', mainController.signup);
router.post('/signup', mainController.userSignUp);

module.exports = router;