const express = require("express");
const hodController = require("../controllers/hodController");
const studentController = require("../controllers/studentController")
const nocController = require("../controllers/nocController");
const isAuthenticated = require('../config/authMiddleware');
const router = express.Router();

router.post('/sign-up', hodController.signup);
router.post('/sign-in', hodController.login);

router.post('/addStudent', isAuthenticated, studentController.signup);
router.get('/allStudents', isAuthenticated, studentController.getAllStudents);

router.get('/allNOCs', isAuthenticated, nocController.getAllNocs);

router.post('/noc/approve', nocController.approveNoc);

router.post('/noc/reject', nocController.rejectNoc);

module.exports = router;