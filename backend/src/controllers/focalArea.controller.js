const FocalArea = require('../models/FocalArea.model');

exports.addFocalArea = async (req, res) => {
    try {
        const result = await FocalArea.addFocalArea(req.body);
        res.status(201).json({ status: true, message: 'Focal area added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getAllFocalAreas = async (req, res) => {
    try {
        const result = await FocalArea.getAllFocalAreas();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};
