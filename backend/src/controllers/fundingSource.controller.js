const FundingSource = require('../models/FundingSource.model');

exports.addFundingSource = async (req, res) => {
    try {
        const result = await FundingSource.addFundingSource(req.body);
        res.status(201).json({ status: true, message: 'Funding source added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};
