const typeController = require("../controllers/typeController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/", typeController.getAllType);
router.get("/", typeController.getDetailType);

router.post(
  "/create",
  middlewareController.verifyTokenAdmin,
  typeController.addNewType
);

router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  typeController.deleteType
);

router.put(
  "/",
  middlewareController.verifyTokenAdmin,
  typeController.updateType
);

module.exports = router;
