const express = require('express');
const router = express.Router();
const controller = require('../controllers/agency.controller');

router.post('/add-agency', controller.addAgency);
router.get('/all', controller.getAllAgencies);


module.exports = router;
