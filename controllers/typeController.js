const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Type = require("../models/type");
const Fish = require("../models/fish");

const typeController = {
  getAllType: async (req, res) => {
    try {
      let { page, pageSize, name, origin } = req.query;
      page = parseInt(page) || 1;
      pageSize = parseInt(pageSize) || 10;

      if (page <= 0 || pageSize <= 0) {
        return res.status(400).json({
          message: "Số lượng trang và phần tử phải là số dương",
          status: 400,
        });
      }

      const skip = (page - 1) * pageSize;

      let query = {};

      if (name) {
        query.name = { $regex: new RegExp(name, "i") };
      }
      if (origin) {
        query.origin = { $regex: new RegExp(origin, "i") };
      }

      try {
        const types = await Type.find(query).skip(skip).limit(pageSize);
        const totalCount = await Type.countDocuments(query);

        if (totalCount === 0) {
          return res.status(404).json({
            message: "Không tìm thấy thương hiệu",
            status: 404,
          });
        }

        const response = {
          types,
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize),
          totalTypes: totalCount,
        };

        return res.status(200).json(response);
      } catch (err) {
        return res.status(400).json(err);
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  getDetailType: async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID của loại cá không hợp lệ",
          status: 400,
        });
      }

      const typeInfo = await Type.findById(req.params.id);
      if (!typeInfo) {
        return res.status(404).json({
          message: "Không tìm thấy loại cá",
          status: 404,
        });
      }

      res.status(200).json({ typeInfo });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  addNewType: async (req, res) => {
    const { name, origin } = req.body;
    try {
      if (!name || !origin) {
        return res.status(400).json({
          message: "Mọi trường dữ liệu đều bắt buộc",
          status: 400,
        });
      }

      const type = new Type(req.body);

      const newType = await type.save();

      if (newType) {
        return res.status(200).json({
          message: "Thêm thương hiệu mới thành công",
          status: 200,
        });
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  deleteType: async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID của loại cá không hợp lệ",
          status: 400,
        });
      }

      const typeInFish = await Fish.findOne({
        type: req.params.id,
      });

      if (typeInFish) {
        return res.status(400).json({
          message:
            "Không thể xóa loại cá. Loại cá vẫn còn tồn tại trong thông tin của cá",
          status: 400,
        });
      }

      const type = await Type.findByIdAndDelete(req.params.id);
      if (!type) {
        return res.status(404).json({
          message: "Không tìm thấy loại cá",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "Xóa thành công",
        status: 200,
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  updateType: async (req, res) => {
    const { id, name, origin } = req.body;

    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "ID của loại cá không hợp lệ",
          status: 400,
        });
      }

      if (!name || !origin || !id) {
        return res.status(400).json({
          message: "Mọi trường dữ liệu đều bắt buộc",
          status: 400,
        });
      }

      const type = await Type.findByIdAndUpdate(
        {
          id,
          name,
          origin,
        },
        { new: true }
      );
      if (type) {
        return res.status(200).json({
          message: "Cập nhật thành công",
          status: 200,
        });
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = typeController;
