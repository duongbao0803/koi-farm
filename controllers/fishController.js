const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Fish = require("../models/fish");
const User = require("../models/user");
const Type = require("../models/type");

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
        const types = await Type.find({
          origin: { $regex: origin, $options: "i" },
        });
        const typeIds = types.map((type) => type._id);
        filter.type = { $in: typeIds };
      }
      if (gender) {
        filter.gender = gender;
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice);
        }
      }

      try {
        const fishes = await Fish.find(filter)
          .select()
          .populate("type")
          .populate("comments")
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
        image,
        gender,
        description,
        size,
        quantity,
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

      if (!ObjectId.isValid(type)) {
        return res.status(400).json({
          message: "ID của loại cá không hợp lệ",
          status: 400,
        });
      }

      if (
        !name ||
        !gender ||
        !image ||
        !description ||
        !quantity ||
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

      if (price <= 0 || quantity <= 0) {
        return res.status(400).json({
          message: "Giá sản phẩm và số lượng phải là số dương",
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
        gender,
        image,
        description,
        size,
        type,
        quantity,
        feedingAmount,
        screeningRate,
        category,
        price,
        certificates,
        yob,
      });

      await newFish.save();

      return res.status(200).json({
        message: "Thêm cá thành công",
        fish: newFish,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
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

      const postsUsingFish = await Post.findOne({
        fish: req.params.id,
      });

      if (postsUsingFish) {
        return res.status(400).json({
          message:
            "Không thể xóa thông tin của cá này. Thông tin của cá còn nằm trong bài viết",
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
      const { id, consignmentStatus } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      if (!consignmentStatus) {
        return res.status(400).json({
          message: "Mọi trường dữ liệu đều bắt buộc",
          status: 400,
        });
      }

      const updatedFish = await Fish.findByIdAndUpdate(
        { id, consignmentStatus },
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
        fishId,
        name,
        origin,
        gender,
        image,
        description,
        quantity,
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
        !image ||
        !description ||
        !size ||
        !quantity ||
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
        image,
        description,
        quantity,
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

  //comment
  addNewComment: async (req, res) => {
    const { rating, content } = req.body;

    try {
      if (!ObjectId.isValid(req.params.fishId)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      const fish = await Fish.findById(req.params.fishId);
      if (!fish) {
        return res.status(404).json({
          message: "Không tìm thấy cá",
          status: 404,
        });
      }

      const existingComment = await Fish.findOne({
        _id: req.params.fishId,
        "comments.author": req.user.id,
      });

      if (existingComment) {
        return res.status(404).json({
          message:
            "Người dùng chỉ được đánh giá và nhận xét 1 lần duy nhất trên mỗi sản phẩm",
          status: 404,
        });
      }

      const user = await User.findById(req.user.id);

      const newComment = {
        rating: rating,
        content: content,
        author: user._id,
      };

      fish.comments.push(newComment);
      await fish.save();

      return res
        .status(200)
        .json({ status: 200, message: "Thêm đánh giá thành công" });
    } catch (err) {
      console.log("check err", err);
      return res.status(400).json(err);
    }
  },

  deleteComment: async (req, res) => {
    const { fishId, commentId } = req.params;

    try {
      if (!ObjectId.isValid(req.params.fishId)) {
        return res.status(400).json({
          message: "ID của cá không hợp lệ",
          status: 400,
        });
      }

      const fish = await Fish.findById(fishId);
      if (!fish) {
        return res.status(404).json({
          message: "Không tìm thấy thông tin của cá",
          status: 404,
        });
      }

      const comment = fish.comments.id(commentId);

      if (!comment) {
        return res.status(404).json({
          message: "Không tìm thấy bình luận",
          status: 404,
        });
      }

      if (
        comment.author.toString() !== req.user.id.toString() &&
        req.user.role !== "ADMIN" &&
        req.user.role !== "STAFF"
      ) {
        return res.status(403).json({
          message: "Bạn không có quyền xóa đánh giá này",
          status: 403,
        });
      }

      fish.comments.pull(comment._id);
      await fish.save();

      return res.status(200).json({
        message: "Xóa đánh giá thành công",
        status: 200,
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  editComment: async (req, res) => {
    const { fishId, commentId } = req.params;
    const { rating, content } = req.body;

    if (!rating || !content) {
      return res.status(400).json({
        message: "Mọi trường dữ liệu đều bắt buộc",
        status: 400,
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Đánh giá sản phẩm phải nằm trong khoảng 1 đến 5 sao",
        status: 400,
      });
    }

    if (content.length < 8) {
      return res.status(400).json({
        message: "Nhận xét phải có ít nhất 8 chữ",
        status: 400,
      });
    }

    try {
      const fish = await Fish.findById(fishId);
      if (!fish) {
        return res.status(404).json({
          message: "Không tìm thấy thông tin của cá",
          status: 400,
        });
      }

      const comment = fish.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({
          message: "Không tìm thấy bình luận",
          status: 400,
        });
      }

      if (comment.author.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "Bạn không có quyền chỉnh sửa đánh giá này",
          status: 403,
        });
      }

      comment.content = content;
      comment.rating = rating;

      await fish.save();
      return res.status(200).json({
        message: "Cập nhật đánh giá thành công",
        status: 200,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  compareFish: async (req, res) => {
    const { fishId1, fishId2 } = req.body;

    if (!fishId1 || !fishId2) {
      return res.status(400).json({ message: "ID của cá không hợp lệ" });
    }

    if (fishId1 === fishId2) {
      return res.status(400).json({
        status: 400,
        message: "Vui lòng chọn 2 con cá khác nhau để so sánh",
      });
    }

    try {
      const [fish1, fish2] = await Promise.all([
        Fish.findById(fishId1).populate("type"),
        Fish.findById(fishId2).populate("type"),
      ]);

      if (!fish1 || !fish2) {
        return res.status(404).json({ message: "Không tìm thấy cá" });
      }

      const comparison = {
        name: {
          fish1: fish1.name,
          fish2: fish2.name,
        },
        image: {
          fish1: fish1.image,
          fish2: fish2.image,
        },
        gender: {
          fish1: fish1.gender,
          fish2: fish2.gender,
        },
        age: {
          fish1: fish1.age,
          fish2: fish2.age,
        },
        size: {
          fish1: fish1.size,
          fish2: fish2.size,
        },
        type: {
          fish1: {
            name: fish1.type.name,
            origin: fish1.type.origin,
          },
          fish2: {
            name: fish2.type.name,
            origin: fish2.type.origin,
          },
        },
        feedingAmount: {
          fish1: fish1.feedingAmount,
          fish2: fish2.feedingAmount,
        },
        screeningRate: {
          fish1: fish1.screeningRate,
          fish2: fish2.screeningRate,
        },
        category: {
          fish1: fish1.category,
          fish2: fish2.category,
        },
        price: {
          fish1: fish1.price,
          fish2: fish2.price,
        },
        certificates: {
          fish1: fish1.certificates,
          fish2: fish2.certificates,
        },
        yob: {
          fish1: fish1.yob,
          fish2: fish2.yob,
        },
      };

      return res.status(200).json(comparison);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = fishController;
