const express = require("express");
const {addProject, getAllProjects} = require("../controllers/project.controller");

const router = express.Router();

router.post("/add-project", addProject);
router.get('/all-project', getAllProjects);

module.exports = router;
