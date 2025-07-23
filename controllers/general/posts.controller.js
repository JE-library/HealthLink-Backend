const response = require("../../utils/response.util.js");
const { default: mongoose } = require("mongoose");
const {
  getPosts,
  getAdminPostDetails,
  getSinglePost,
} = require("../../services/post.service.js");
const Post = require("../../models/Post.js");

// ADMIN POST CONTROLLER

const postsController = {
  //GET ALL POSTS
  getPosts: async (req, res, next) => {
    try {
      const posts = await getPosts();

      //if there's no posts respond with none found
      if (!posts || posts.length === 0) {
        return response(res, "posts", [], 200, true, "No posts found");
      }
      // Respond with the all posts
      response(res, "posts", posts);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE POST DETAILS
  getSinglePost: async (req, res, next) => {
    try {
      const postId = req.params.id;

      //check if the postId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }
      const post = await getSinglePost(postId);

      response(res, "post", post, 200, true, "Post Retrieved Successfully.");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = postsController;
