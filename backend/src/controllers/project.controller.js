const Project = require('../models/Project.model');

exports.addProject = async (req, res) => {
    try {
        const result = await Project.addProjectWithRelations(req.body);
        res.status(201).json({ status: true, message: 'Project added successfully', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Server Error: ${e.message}` });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const result = await Project.getAllProjects();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};
