const express = require("express");
const authRoutes = require("./auth.routes");
const testRoutes = require("./test.routes");
const projectRoutes = require("./project.routes");
const agencyRoutes = require("./agency.routes");
const locationRoutes = require("./location.routes");
const fundingSource = require("./fundingSource.routes");
const focalArea = require("./focalArea.routes");
const pendingProjectRoutes = require("./pendingProject.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/project", projectRoutes)
router.use("/agency", agencyRoutes)
router.use("/location", locationRoutes)
router.use("/funding-source", fundingSource)
router.use("/focal-area", focalArea)
router.use("/pending-project", pendingProjectRoutes)

module.exports = router;
