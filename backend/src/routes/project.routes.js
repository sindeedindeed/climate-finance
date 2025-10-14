const express = require("express");
const {addProject, getAllProjects, updateProject, deleteProject, getProjectById, getProjectsOverviewStats,
    getProjectByStatus, getProjectTrend, getOverViewStats,
    getFundingSourceByType, getFundingSourceOverview, getFundingSourceTrend, 
    getFundingSourceSectorAllocation, getFundingSource
} = require("../controllers/project.controller");

const router = express.Router();

router.post("/add-project", addProject);
router.get('/all-project', getAllProjects);
router.put('/update/:id', updateProject);
router.delete('/delete/:id', deleteProject);
router.get('/get/:id', getProjectById);
//projects
router.get('/projectsOverviewStats', getProjectsOverviewStats)
router.get('/get-project-by-status', getProjectByStatus)
router.get('/get-project-by-trend', getProjectTrend)
//dashboard
router.get('/get-overview-stat', getOverViewStats)

// Funding Source Analytics (keep these in project routes for now)
router.get('/get-funding-source-by-type', getFundingSourceByType);
router.get('/get-funding-source-overview', getFundingSourceOverview);
router.get('/get-funding-source-trend', getFundingSourceTrend);
router.get('/get-funding-source-sector-allocation', getFundingSourceSectorAllocation);
router.get('/get-funding-source', getFundingSource);

module.exports = router;
