const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/postPosts", authMiddleware, postController.postPosts);

module.exports = router;
