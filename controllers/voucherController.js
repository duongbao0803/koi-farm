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
    const { code, discountAmount, expireDate, usageLimit } = req.body;

    try {
      const voucher = new Voucher({
        code,
        discountAmount,
        expireDate,
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
        id,
        { code, discountAmount, expireDate, isActive, usageLimit },
        { new: true }
      );

      if (!voucher)
        return res.status(404).json({ err: "Không tìm thấy voucher" });
      return res
        .status(200)
        .json({ status: 200, message: "Cập nhật voucher thành công" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  useVoucher: async (req, res) => {
    const myId = req.user.id;

    const { code, fishId } = req.body;
    try {
      const voucher = await Voucher.findOne({ code: code });

      if (!voucher) {
        return res
          .status(404)
          .json({ status: 404, message: "Không tìm thấy voucher" });
      }

      if (voucher.expireDate < new Date()) {
        return res
          .status(400)
          .json({ status: 400, message: "Voucher đã hết hạn" });
      }

      if (!voucher.isActive) {
        return res
          .status(400)
          .json({ status: 400, message: "Voucher không hợp lệ" });
      }

      if (voucher.usageLimit < 1) {
        return res
          .status(400)
          .json({ status: 400, message: "Voucher không hợp lệ" });
      }

      if (voucher.usedBy.some((usage) => usage._id.toString() === myId)) {
        return res
          .status(404)
          .json({ status: 404, message: "Voucher không hợp lệ" });
      }

      const fish = await Fish.findById(fishId);
      if (!fish) {
        return res
          .status(400)
          .json({ status: 400, message: "Không tìm thấy cá" });
      }

      const discountedPrice = Math.max(
        fish.price - fish.price * (voucher.discountAmount / 100),
        0
      );

      voucher.usedBy.push({ _id: myId });
      voucher.usageLimit--;
      await voucher.save();

      return res.status(200).json({
        status: 200,
        message: "Áp dụng voucher thành công",
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

      if (!voucher)
        return res.status(404).json({ err: "Không tìm thấy voucher" });
      return res
        .status(200)
        .json({ status: 200, message: "Xóa voucher thành công" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = voucherController;
