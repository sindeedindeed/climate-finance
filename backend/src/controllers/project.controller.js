const Project = require('../models/Project.model');
const { isDBAvailable } = require('../config/db');
const mockDataService = require('../services/mockDataService');

exports.addProject = async (req, res) => {
    try {
        if (isDBAvailable()) {
            const result = await Project.addProjectWithRelations(req.body);
            res.status(201).json({ status: true, message: 'Project added successfully', data: result });
        } else {
            const result = mockDataService.addProject(req.body);
            res.status(201).json(result);
        }
    } catch (e) {
        res.status(500).json({ status: false, message: `Server Error: ${e.message}` });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        if (isDBAvailable()) {
            const result = await Project.getAllProjects();
            res.status(200).json({ status: true, data: result });
        } else {
            const result = mockDataService.getAllProjects();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.updateProject = async (req, res) => {
    try {
        if (isDBAvailable()) {
            const result = await Project.updateProject(req.params.id, req.body);
            res.status(200).json({ status: true, message: 'Project updated', data: result });
        } else {
            const result = mockDataService.updateProject(req.params.id, req.body);
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        if (isDBAvailable()) {
            await Project.deleteProject(req.params.id);
            res.status(200).json({ status: true, message: 'Project deleted' });
        } else {
            const result = mockDataService.deleteProject(req.params.id);
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        if (isDBAvailable()) {
            const result = await Project.getProjectById(req.params.id);
            if (!result) {
                return res.status(404).json({ status: false, message: 'Project not found' });
            }
            res.status(200).json({ status: true, data: result });
        } else {
            const result = mockDataService.getProjectById(req.params.id);
            if (!result.status) {
                return res.status(404).json(result);
            }
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({ status: false, message: `Error: ${e.message}` });
    }
};

exports.getProjectsOverviewStats = async (req, res)=> {
    try {
        if (isDBAvailable()) {
            const response = await Project.getProjectsOverviewStats()
            res.status(200).json({ status: true, data: response });
        } else {
            const result = mockDataService.getProjectsOverviewStats();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectByStatus = async (req, res)=> {
    try {
        if (isDBAvailable()) {
            const response = await Project.getProjectByStatus()
            res.status(200).json({ status: true, data: response });
        } else {
            const result = mockDataService.getProjectByStatus();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectBySector = async (req, res)=> {
    try {
        if (isDBAvailable()) {
            const response = await Project.getProjectBySector()
            res.status(200).json({ status: true, data: response });
        } else {
            const result = mockDataService.getProjectBySector();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getProjectByType = async (req, res)=> {
    try {
        if (isDBAvailable()) {
            const response = await Project.getProjectByType()
            res.status(200).json({ status: true, data: response });
        } else {
            const result = mockDataService.getProjectByType();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getFundingSourceByType = async (req, res)=> {
    try {
        const response = await Project.getFundingSourceByType()
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

//Dashboard

exports.getOverViewStats = async (req, res)=> {
    try {
        const response = await Project.getOverviewStats()
        res.status(200).json({ status: true, data: response });
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};

exports.getRegionalDistribution = async (req, res)=> {
    try {
        if (isDBAvailable()) {
            const response = await Project.getRegionalDistribution()
            res.status(200).json({ status: true, data: response });
        } else {
            const result = mockDataService.getRegionalDistribution();
            res.status(200).json(result);
        }
    } catch (e) {
        res.status(500).json({status: false, message: `Server Error: ${e.message}`});
    }
};
