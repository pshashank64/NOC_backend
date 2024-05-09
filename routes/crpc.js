const express = require("express");
const nocController = require("../controllers/nocController");
const crpcController = require("../controllers/crpcController")
const isAuthenticated = require('../config/authMiddleware');
const router = express.Router();

router.post('/sign-up', crpcController.signup);
router.post('/sign-in', crpcController.login);

router.get('/allNOCs', isAuthenticated, nocController.getAllNocs);

router.post('/noc/approve', nocController.approveNoc);

router.post('/noc/reject', nocController.rejectNoc);

router.get('/noc/verify', crpcController.verifyNOC);

module.exports = router;