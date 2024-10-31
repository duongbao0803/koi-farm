const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const fishRoutes = require("./fish");
const typeRoutes = require("./type");
const postRoutes = require("./post");
const voucherRoutes = require("./voucher");
const orderRoutes = require("./order");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/fish", fishRoutes);
router.use("/post", postRoutes);
router.use("/type", typeRoutes);
router.use("/voucher", voucherRoutes);
router.use("/order", orderRoutes);

module.exports = router;
