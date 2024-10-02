const postController = require("../controllers/postController");
const middlewareController = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/", postController.getAllPost);
router.get("/:id", postController.getDetailPost);
router.delete(
  "/:id",
  middlewareController.verifyTokenAdmin,
  postController.deletePost
);

router.put(
  "/",
  middlewareController.verifyTokenAdmin,
  postController.updatePost
);

router.post("/", middlewareController.verifyTokenAdmin, postController.addPost);

module.exports = router;
