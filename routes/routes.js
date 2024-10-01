const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const fishRoutes = require("./fish");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/fish", fishRoutes);

module.exports = router;
