const Post = require("../models/Post");

const postService = {
  //Get all wellness and nutrition posts
  getPosts: async () => {
    return await Post.find().sort({ createdAt: -1 });
  },
};

module.exports = postService;
