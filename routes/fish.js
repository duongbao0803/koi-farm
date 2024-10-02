const fishController = require("../controllers/fishController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/", fishController.getAllFish);

router.get("/:id", fishController.getDetailFish);

router.post(
  "/create",
  middlewareController.verifyTokenAdmin,
  fishController.addFish
);

router.put("/", middlewareController.verifyToken, fishController.editFish);

router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  fishController.deleteFish
);

router.put(
  "/consignmentStatus",
  middlewareController.verifyTokenAdmin,
  fishController.updateConsignmentStatus
);

router.post(
  "/:fishId/comment",
  middlewareController.verifyTokenMember,
  fishController.addNewComment
);

router.delete(
  "/:fishId/comment/:commentId",
  middlewareController.verifyToken,
  fishController.deleteComment
);

router.put(
  "/:fishId/comment/:commentId",
  middlewareController.verifyToken,
  fishController.editComment
);

module.exports = router;
