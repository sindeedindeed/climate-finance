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

exports.updateProject = async (req, res) => {
    try {
        const result = await Project.updateProject(req.params.id, req.body);
        res.status(200).json({ status: true, message: 'Project updated', data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.deleteProject(req.params.id);
        res.status(200).json({ status: true, message: 'Project deleted' });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const result = await Project.getProjectById(req.params.id);
        if (!result) {
            return res.status(404).json({ status: false, message: 'Project not found' });
        }
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getProjectsOverviewStats = async (req, res)=> {
    try {
        const response = await Project.getProjectsOverviewStats()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectByStatus = async (req, res)=> {
    try {
        const response = await Project.getProjectByStatus()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectBySector = async (req, res)=> {
    try {
        const response = await Project.getProjectBySector()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectByType = async (req, res)=> {
    try {
        const response = await Project.getProjectByType()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectTrend = async (req, res)=> {
    try {
        const response = await Project.getProjectTrend()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getFundingSourceOverview = async (req, res)=> {
    try {
        const response = await Project.getFundingSourceOverviewStats()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getFundingSourceTrend = async (req, res)=> {
    try {
        const response = await Project.getFundingSourceTrend()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getFundingSourceSectorAllocation = async (req, res)=> {
    try {
        const response = await Project.getFundingSourceSectorAllocation()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getFundingSource = async (req, res)=> {
    try {
        const response = await Project.getFundingSource()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};
