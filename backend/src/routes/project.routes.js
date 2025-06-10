const express = require("express");
const {addProject} = require("../controllers/project.controller");

const router = express.Router();

router.post("/add-project", addProject);

module.exports = router;
