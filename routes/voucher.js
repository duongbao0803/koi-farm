const voucherController = require("../controllers/voucherController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/", voucherController.getAllVoucher);
router.post(
  "/create",
  middlewareController.verifyTokenAdmin,
  voucherController.addNewVoucher
);

router.put(
  "/",
  middlewareController.verifyTokenAdmin,
  voucherController.editVoucher
);

router.post(
  "/",
  middlewareController.verifyTokenMember,
  voucherController.useVoucher
);

router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  voucherController.deleteVoucher
);

module.exports = router;
