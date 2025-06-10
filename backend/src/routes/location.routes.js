const express = require('express');
const router = express.Router();
const controller = require('../controllers/location.controller');

router.post('/add-location', controller.addLocation);

module.exports = router;
