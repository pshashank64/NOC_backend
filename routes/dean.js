const express = require("express");
const nocController = require("../controllers/nocController");
const deanController = require("../controllers/deanController");
const isAuthenticated = require('../config/authMiddleware');
const router = express.Router();

router.post('/sign-up', deanController.signup);
router.post('/sign-in', deanController.login);

router.get('/allNOCs', isAuthenticated, nocController.getAllNocs);

router.post('/noc/approve', nocController.approveNoc);

router.post('/noc/reject', nocController.rejectNoc);

module.exports = router;