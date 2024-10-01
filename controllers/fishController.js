const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Fish = require("../models/fish.model");

const fishController = {
  getAllFish: async (req, res) => {
    try {
      let {
        page,
        pageSize,
        category,
        name,
        origin,
        gender,
        minPrice,
        maxPrice,
      } = req.query;
      page = parseInt(page) || 1;
      pageSize = parseInt(pageSize) || 10;

      if (page <= 0 || pageSize <= 0) {
        return res.status(400).json({
          message: "Số lượng trang và phần tử phải là số dương",
          status: 400,
        });
      }

      const skip = (page - 1) * pageSize;
      const filter = {};
      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }
      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }
      if (origin) {
        filter.origin = { $regex: origin, $options: "i" };
      }
      if (gender) {
        filter.gender = { $regex: gender, $options: "i" };
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) {
          query.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          query.price.$lte = parseFloat(maxPrice);
        }
      }

      try {
        const fishes = await Fish.find(filter)
          .select()
          .skip(skip)
          .limit(pageSize);
        const totalCount = await Fish.countDocuments(filter);

        if (skip >= totalCount) {
          return res.status(404).json({
            message: "Không tìm thấy cá",
            status: 404,
          });
        }

        const result = {
          fishes,
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize),
          totalFishes: totalCount,
        };

        return res.status(200).json(result);
      } catch (err) {
        return res.status(400).json(err);
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  getDetailFish: async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }
      const fishInfo = await Fish.findById(req.params.id)
        .populate("type")
        .populate({
          path: "comments.author",
          select: "name",
        });
      if (!fishInfo) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
          status: 404,
        });
      }

      return res.status(200).json({ fishInfo });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  addFish: async (req, res) => {
    try {
      const {
        name,
        origin,
        gender,
        size,
        type,
        feedingAmount,
        screeningRate,
        category,
        price,
        certificates,
        yob,
      } = req.body;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      if (
        !name ||
        !origin ||
        !gender ||
        !size ||
        !type ||
        !feedingAmount ||
        !screeningRate ||
        !category ||
        !price ||
        !yob
      ) {
        return res.json({
          status: 404,
          message: "Mọi trường dữ liệu đều bắt buộc",
        });
      }

      if (price <= 0) {
        return res.status(400).json({
          message: "Giá sản phẩm phải là số dương",
          status: 400,
        });
      }

      if (yob > currentYear) {
        return res.status(400).json({
          message: "Năm sinh của cá phải trong quá khứ",
          status: 400,
        });
      }

      const newFish = new Fish({
        name,
        origin,
        gender,
        size,
        type,
        feedingAmount,
        screeningRate,
        category,
        price,
        sold,
        certificates,
        yob,
      });

      await newFish.save();

      return res.status(200).json({
        message: "Thêm cá thành công",
        fish: newFish,
      });
    } catch (error) {
      return res.status(400).json({ message: "Thêm cá thất bại" });
    }
  },

  deleteFish: async (req, res) => {
    try {
      const fishId = req.params.id;
      if (!ObjectId.isValid(fishId)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      const deletedFish = await Fish.findByIdAndDelete(fishId);
      if (!deletedFish) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm để xóa",
          status: 404,
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Xóa cá thành công",
      });
    } catch (error) {
      return res.status(400).json({ message: "Xóa cá thất bại" });
    }
  },

  updateConsignmentStatus: async (req, res) => {
    try {
      const fishId = req.params.id;
      if (!ObjectId.isValid(fishId)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      const { consignmentStatus } = req.body;
      if (!consignmentStatus) {
        return res.status(400).json({
          message: "Mọi trường dữ liệu đều bắt buộc",
          status: 400,
        });
      }

      const updatedFish = await Fish.findByIdAndUpdate(
        fishId,
        { consignmentStatus },
        { new: true }
      );

      if (!updatedFish) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm để cập nhật",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "Cập nhật trạng thái kí gửi thành công",
        fish: updatedFish,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Cập nhật trạng thái consignemnt thất bại" });
    }
  },

  editFish: async (req, res) => {
    try {
      const {
        name,
        origin,
        gender,
        size,
        type,
        feedingAmount,
        screeningRate,
        category,
        price,
        certificates,
        yob,
      } = req.body;
      const fishId = req.params.id;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      if (!ObjectId.isValid(fishId)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      if (
        !name ||
        !origin ||
        !gender ||
        !size ||
        !type ||
        !feedingAmount ||
        !screeningRate ||
        !category ||
        !price ||
        !yob
      ) {
        return res.json({
          status: 404,
          message: "Mọi trường dữ liệu đều bắt buộc",
        });
      }

      if (price <= 0) {
        return res.status(400).json({
          message: "Giá sản phẩm phải là số dương",
          status: 400,
        });
      }

      if (yob > currentYear) {
        return res.status(400).json({
          message: "Năm sinh của cá phải trong quá khứ",
          status: 400,
        });
      }

      const updatedData = {
        name,
        origin,
        gender,
        size,
        type,
        feedingAmount,
        screeningRate,
        category,
        price,
        certificates,
        yob,
      };

      const updatedFish = await Fish.findByIdAndUpdate(fishId, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!updatedFish) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm để cập nhật",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "Cập nhật thông tin cá thành công",
        fish: updatedFish,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Cập nhật thông tin cá thất bại" });
    }
  },
};

module.exports = fishController;
