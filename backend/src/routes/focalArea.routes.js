const express = require('express');
const router = express.Router();
const controller = require('../controllers/focalArea.controller');

router.post('/add-focal-area', controller.addFocalArea);

module.exports = router;
