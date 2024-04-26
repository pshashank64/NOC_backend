const express = require("express");
const nocController = require('../controllers/nocController')
const isAuthenticated = require("../config/authMiddleware");
const router = express.Router();

router.post('/addNoc', isAuthenticated, nocController.addNocReq );
router.get('/getNoc', isAuthenticated, nocController.getNoc);

module.exports = router;