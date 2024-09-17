const express = require("express");
const studentController = require('../controllers/studentController')
const isAuthenticated = require("../config/authMiddleware");
const router = express.Router();

router.post('/sign-up', studentController.signup);
router.post('/sign-in', studentController.login);

router.post('/logout', studentController.logout);

router.get('/getStudent', studentController.getUser);

router.get('/download-noc/:nocId', studentController.downloadNoc);

router.post('/uploadNoc', studentController.upload.single('nocFile'), studentController.uploadNoc);

router.get('/downloadNoc/:studentId', studentController.downloadNocPhysical);

router.post('/addLeetcodeUrl', studentController.addLeetcodeUrl);

router.get('/getuploadednoc/:studentId', studentController.getLeetCodeUrl);

module.exports = router;