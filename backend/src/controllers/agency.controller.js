const Agency = require('../models/Agency.model');

exports.addAgency = async (req, res) => {
    try {
        const result = await Agency.addAgency(req.body);
        res.status(201).json({ status: true, message: 'Agency added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getAllAgencies = async (req, res) => {
    try {
        const result = await Agency.getAllAgencies();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};