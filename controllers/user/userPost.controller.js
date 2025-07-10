const { getPosts } = require("../../services/post.service");
const response = require("../../utils/response.util");

const userPostController = {
  getPostsUser: async (req, res, next) => {
    try {
      const posts = await getPosts();

      if (!posts || posts.length === 0) {
        return response(res, "posts", [], 200, true, "No wellness posts found");
      }

      response(res, "posts", posts);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userPostController;
