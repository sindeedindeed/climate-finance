const express = require("express");
const authRoutes = require("./auth.routes");
const testRoutes = require("./test.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);

module.exports = router;
