const response = require("../../utils/response.util.js");
const User = require("../../models/User.js");
const cloudinary = require("../../config/cloudinary.config.js");
const {
  getProviderAppointments,
  cancelProviderAppointment,
  getProviderAppointmentDetails,
  confirmProviderAppointment,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");
const {
  getAdminUsers,
  getUserById,
} = require("../../services/user.service.js");
const Notification = require("../../models/Notification.js");
const {
  getPosts,
  getAdminPostDetails,
} = require("../../services/post.service.js");
const Post = require("../../models/Post.js");

// ADMIN POST CONTROLLER

const adminPostsController = {
  //GET ALL POSTS
  getPostsAdmin: async (req, res, next) => {
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
  getPostDetailsAdmin: async (req, res, next) => {
    try {
      const postId = req.params.id;

      //check if the postId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }
      const post = await getAdminPostDetails(postId);

      response(res, "post", post, 200, true, "Post Retrieved Successfully.");
    } catch (error) {
      next(error);
    }
  },
  // DELETE POST
  deletePostAdmin: async (req, res, next) => {
    try {
      const postId = req.params.id;

      //check if the postId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }
      const post = await getAdminPostDetails(postId);

      //delete Post Image if any
      await cloudinary.uploader.destroy(post.postImage.public_id);

      const deletedPost = await Post.deleteOne({ _id: postId });

      response(
        res,
        "deletedPost",
        deletedPost,
        200,
        true,
        "Post Deleted Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminPostsController;
