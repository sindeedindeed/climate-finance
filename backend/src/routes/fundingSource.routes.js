const express = require('express');
const router = express.Router();
const controller = require('../controllers/fundingSource.controller');

router.post('/add-funding-source', controller.addFundingSource);

module.exports = router;
