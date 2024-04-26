const express = require("express");
const studentController = require('../controllers/studentController')
const isAuthenticated = require("../config/authMiddleware");
const router = express.Router();

router.post('/sign-up', studentController.signup);
router.post('/sign-in', studentController.login);

router.post('/logout', studentController.logout);

router.get('/getStudent', studentController.getUser);

module.exports = router;