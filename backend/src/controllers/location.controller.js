const Location = require('../models/Location.model');

exports.addLocation = async (req, res) => {
    try {
        const result = await Location.addLocation(req.body);
        res.status(201).json({ status: true, message: 'Location added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getAllLocations = async (req, res) => {
    try {
        const result = await Location.getAllLocations();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};