const express = require("express");
const {addProject, getAllProjects, updateProject, deleteProject, getProjectById, getProjectsOverviewStats,
    getProjectByStatus, getProjectBySector, getProjectTrend, getProjectByType, getFundingSourceOverview,
    getFundingSourceTrend, getFundingSourceSectorAllocation, getFundingSource, getFundingSourceByType, getOverViewStats,
    getRegionalDistribution
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
router.get('/get-project-by-sector', getProjectBySector)
router.get('/get-project-by-trend', getProjectTrend)
//funding-source
router.get('/get-project-by-type', getProjectByType)
router.get('/get-funding-source-by-type', getFundingSourceByType)
router.get('/get-funding-source-overview', getFundingSourceOverview)
router.get('/get-funding-source-trend', getFundingSourceTrend)
router.get('/get-funding-source-sector-allocation', getFundingSourceSectorAllocation)
router.get('/get-funding-source', getFundingSource)
//dashboard
router.get('/get-overview-stat', getOverViewStats)
router.get('/get-regional-distribution', getRegionalDistribution)





module.exports = router;
