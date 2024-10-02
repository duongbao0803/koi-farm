const userController = require("../controllers/userController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get(
  "/",
  middlewareController.verifyTokenAdmin,
  userController.getAllUser
);

router.get(
  "/:id",
  middlewareController.verifyTokenAdmin,
  userController.getDetailUser
);

router.put(
  "/personal-information",
  middlewareController.verifyToken,
  userController.editInfoPersonal
);

router.put(
  "/change-password",
  middlewareController.verifyToken,
  userController.changePassword
);

router.put(
  "/",
  middlewareController.verifyTokenAdmin,
  userController.updateUser
);

router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  userController.updateStatusUser
);

module.exports = router;
