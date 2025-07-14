const {
  getPosts,
  createPost,
  getProviderPosts,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../../services/post.service");
const response = require("../../utils/response.util");
const {
  postSchema,
  updatePostSchema,
} = require("../../validations/post.validation");
const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");
const { default: mongoose } = require("mongoose");

const providerPostController = {
  //CREATE POST PROVIDER
  createPostProvider: async (req, res, next) => {
    try {
      const { title, description, categories, tags } = req.body;
      const { error, value } = postSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      let postImage = { url: value.postImage };
      //check if an image is attached
      //upload image to cloudinary
      const file = req.file;
      if (file) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "healthlink/serviceProviders/posts",
        });
        postImage = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };

        //delete local file
        await fs.unlink(file.path);
      }

      const newPost = await createPost({
        title,
        description,
        categories,
        tags,
        postImage,
        author: req.user._id,
      });

      response(res, "post", newPost, 201, true, "Post created sucessfully!");
    } catch (error) {
      next(error);
    }
  },

  //GET POST PROVIDER
  getPostsProvider: async (req, res, next) => {
    try {
      const posts = await getProviderPosts(req.user._id);

      if (!posts || posts.length === 0) {
        return response(
          res,
          "posts",
          [],
          200,
          true,
          `No wellness posts found for ${req.user.fullName}`
        );
      }

      response(res, "posts", posts, 200, true, "Posts Retrieved Successfully!");
    } catch (error) {
      next(error);
    }
  },
  //GET single POST PROVIDER
  getSinglePostProvider: async (req, res, next) => {
    try {
      const postId = req.params.id;

      //check if its a valid mongoose objectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }

      const posts = await getSinglePost(postId);

      if (!posts || posts.length === 0) {
        return response(
          res,
          "posts",
          [],
          200,
          true,
          `No wellness posts found for ${req.user.fullName}`
        );
      }

      response(res, "posts", posts, 200, true, "Post Retrieved Successfully!");
    } catch (error) {
      next(error);
    }
  },

  //UPDATE POST PROVIDER
  updatePostProvider: async (req, res, next) => {
    const postId = req.params.id;
    try {
      //check if its a valid mongoose objectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }
      const { title, description, categories, tags } = req.body;
      const { error, value } = updatePostSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const postExists = await getSinglePost(postId);

      // Handle  photo if uploaded
      let postImageData = {};
      if (req.file) {
        // Delete old photo from Cloudinary if it exists
        if (postExists.postImage.public_id) {
          await cloudinary.uploader.destroy(postExists.postImage.public_id);
        }
        // Upload new photo
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "healthlink/serviceProviders/posts",
        });

        // Delete the local file
        await fs.unlink(req.file.path);
        //Add Image data to
        postImageData = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      }

      const updatedPost = await updatePost(postId, {
        title: title ?? postExists.title,
        description: description ?? postExists.description,
        postImage: postImageData.url ? postImageData : postExists.postImage,
        categories: categories ?? postExists.categories,
        tags: tags ?? postExists.tags,
      });

      response(
        res,
        "post",
        updatedPost,
        200,
        true,
        "Post Updated Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
  //DELETE POST PROVIDER
  deletePostProvider: async (req, res, next) => {
    const postId = req.params.id;
    try {
      //check if its a valid mongoose objectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID" });
      }

      const postExists = await getSinglePost(postId);

      // Delete  photo from Cloudinary if it exists
      if (postExists.postImage.public_id) {
        await cloudinary.uploader.destroy(postExists.postImage.public_id);
      }

      const deletedPost = await deletePost(postExists._id);

      response(
        res,
        "Deleted Post",
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

module.exports = providerPostController;
