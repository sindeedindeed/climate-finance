const Location = require('../models/Location.model');

exports.addLocation = async (req, res) => {
    try {
        const result = await Location.addLocation(req.body);
        res.status(201).json({ status: true, message: 'Location added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};
