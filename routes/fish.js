const fishController = require("../controllers/fishController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/", fishController.getAllFish);

router.get("/:id", fishController.getDetailFish);

router.put("/:id", middlewareController.verifyToken, fishController.editFish);

router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  fishController.deleteFish
);

router.put(
  "/:id",
  middlewareController.verifyTokenAdmin,
  fishController.updateConsignmentStatus
);

module.exports = router;
