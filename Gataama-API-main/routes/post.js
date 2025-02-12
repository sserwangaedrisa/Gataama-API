const express = require("express");
const postController = require("../controllers/post");
const reactionController = require("../controllers/reaction");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const upload = require("../middleware/image-upload");

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  postController.createPost
);
router.get("/search", postController.search);
router.get('/popular', postController.getPopularPosts);
router.get("/", postController.getAllPosts);
router.get("/published", postController.getAllPublishedPosts);
router.get("/:id", postController.getPostById);

router.put(
  "/publish/:id",
  verifyToken,
  isAdmin,
  
  postController.publishPost
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  postController.updatePost
);
router.delete("/:id", verifyToken, isAdmin, postController.deletePost);


///reaction route
router.post('/:id/reactions', verifyToken, reactionController.addReaction);


router.delete('/:id/reactions', verifyToken, reactionController.removeReaction);


// Route to get all reactions for a post
router.get('/:id/reactions', reactionController.getReactions);

module.exports = router;
