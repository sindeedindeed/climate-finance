const express = require("express");
const {addProject, getAllProjects, updateProject, deleteProject, getProjectById, getProjectsOverviewStats} = require("../controllers/project.controller");

const router = express.Router();

router.post("/add-project", addProject);
router.get('/all-project', getAllProjects);
router.put('/update/:id', updateProject);
router.delete('/delete/:id', deleteProject);
router.get('/get/:id', getProjectById);
router.get('/projectsOverviewStats', getProjectsOverviewStats)



module.exports = router;
