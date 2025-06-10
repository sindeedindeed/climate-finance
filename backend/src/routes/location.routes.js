const express = require('express');
const router = express.Router();
const controller = require('../controllers/location.controller');

router.post('/add-location', controller.addLocation);
router.get('/all', controller.getAllLocations);

module.exports = router;
