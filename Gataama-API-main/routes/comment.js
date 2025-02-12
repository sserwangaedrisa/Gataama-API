const express = require("express");
const commentController = require("../controllers/comment");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, commentController.createComment);

router.get("/", commentController.getAllComments);

router.get("/posts/:postId", commentController.getCommentsByPostId); 

router.get("/:id", commentController.getCommentsByPostId); 

router.put("/:id", verifyToken, commentController.updateComment);

router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;
