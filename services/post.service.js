const Post = require("../models/Post");

const postService = {
  //create new post
  createPost: async (data) => {
    return Post.create(data);
  },

  //Get all wellness and nutrition posts
  getPosts: async () => {
    return await Post.find()
      .sort({ createdAt: -1 })
      .populate(
        "author",
        "fullName email phoneNumber specialization profilePhoto"
      );
  },
  //Get single Post
  getSinglePost: async (postId) => {
    const post = await Post.findById(postId).populate(
      "author",
      "fullName email phoneNumber specialization profilePhoto"
    );
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    return post;
  },
  // Update Post
  updatePost: async (postId, data) => {
    return await Post.findByIdAndUpdate(postId, data, { new: true });
  },
  // Delete Post
  deletePost: async (postId) => {
    return await Post.deleteOne({ _id: postId });
  },
  //Get all Posts Provider
  getProviderPosts: async (providerId) => {
    return await Post.find({ author: providerId });
  },
};

module.exports = postService;
