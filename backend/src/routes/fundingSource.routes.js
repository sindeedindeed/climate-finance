const express = require('express');
const router = express.Router();
const controller = require('../controllers/fundingSource.controller');

router.post('/add-funding-source', controller.addFundingSource);
router.get('/all', controller.getAllFundingSources);

module.exports = router;
