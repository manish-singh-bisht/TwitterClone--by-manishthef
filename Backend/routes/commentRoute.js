const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { postComment, deleteComment, likeAndUnlikeComment, findCommentById, findRepliesById } = require("../controllers/commentController");

router.route("/post/comment/:id").post(isAuthenticated, postComment);
router.route("/post/comment/:id").delete(isAuthenticated, deleteComment);
router.route("/post/comment/:id").get(isAuthenticated, likeAndUnlikeComment);
router.route("/comment/:id").get(isAuthenticated, findCommentById);
router.route("/comment/reply/:id/:handle").get(isAuthenticated, findRepliesById);
module.exports = router;
