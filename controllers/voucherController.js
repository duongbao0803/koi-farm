const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Type = require("../models/type");
const Fish = require("../models/fish");
const Voucher = require("../models/voucher");

const voucherController = {
  getAllVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.find({});
      if (voucher) {
        return res.status(200).json(voucher);
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  addNewVoucher: async (req, res) => {
    const { code, discountAmount, expireDate, isActive, usageLimit } = req.body;

    try {
      const voucher = new Voucher({
        code,
        discountAmount,
        expireDate,
        isActive,
        usageLimit,
      });

      await voucher.save();
      return res
        .status(200)
        .json({ status: 200, message: "Thêm voucher thành công" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  editVoucher: async (req, res) => {
    const { id, code, discountAmount, expireDate, isActive, usageLimit } =
      req.body;

    try {
      const voucher = await Voucher.findByIdAndUpdate(
        { id, code, discountAmount, expireDate, isActive, usageLimit },
        { new: true }
      );

      if (!voucher) return res.status(404).json({ err: "Voucher not found" });
      return res
        .status(200)
        .json({ status: 200, message: "Cập nhật voucher thành công" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  useVoucher: async (req, res) => {
    const { userId, code, fishId } = req.body;

    try {
      const voucher = await Voucher.findOne({ code: code });

      if (!voucher) {
        return res.status(404).json({ err: "Voucher not found" });
      }

      if (voucher.expireDate < new Date()) {
        return res.status(400).json({ err: "Voucher has expired" });
      }

      if (!voucher.isActive) {
        return res.status(400).json({ err: "Voucher is inactive" });
      }

      const userHasUsed = voucher.usedBy.some(
        (usage) => usage.userId.toString() === userId
      );

      if (userHasUsed) {
        return res
          .status(400)
          .json({ err: "Voucher has already been used by this user" });
      }

      const fish = await Fish.findById(fishId);
      if (!fish) {
        return res.status(404).json({ err: "Fish not found" });
      }

      const discountedPrice = Math.max(fish.price - voucher.discountAmount, 0); // Ensure price doesn't go below 0

      voucher.usedBy.push({ userId });
      await voucher.save();

      return res.status(200).json({
        status: 200,
        message: "Voucher applied successfully",
        originalPrice: fish.price,
        discountedPrice: discountedPrice,
        discountAmount: voucher.discountAmount,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteVoucher: async (req, res) => {
    try {
      const voucher = await Voucher.findByIdAndDelete(req.params.id);

      if (!voucher) return res.status(404).json({ err: "Voucher not found" });
      return res.status(200).json({ status: 200, message: "Voucher deleted" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = voucherController;
