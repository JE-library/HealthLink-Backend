const response = require("../../utils/response.util.js");
const { default: mongoose } = require("mongoose");
const {
  getPosts,
  getAdminPostDetails,
  getSinglePost,
} = require("../../services/post.service.js");
const Post = require("../../models/Post.js");
const {
  getProviders,
  getProviderById,
} = require("../../services/serviceProvider.service.js");
const ServiceProvider = require("../../models/ServiceProvider.js");

// ADMIN POST CONTROLLER

const providersController = {
  //GET ALL PROVIDERS
  getProviders: async (req, res, next) => {
    try {
      const { fullName, specialization, experienceYears } = req.query;

      const query = {};

      if (fullName) {
        query.fullName = { $regex: fullName, $options: "i" };
      }

      if (specialization) {
        query.specialization = { $regex: specialization, $options: "i" };
      }

      if (experienceYears) {
        query.experienceYears = { $gte: Number(experienceYears) };
      }
      const providers = await ServiceProvider.find(query, {
        note: 0,
        email: 0,
        password: 0,
        phoneNumber: 0,
        dateOfBirth: 0,
        updatedAt: 0,
      });

      if (!providers || providers.length === 0) {
        return response(res, "providers", [], 200, true, "No providers found");
      }

      response(res, "providers", providers);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE PROVIDER
  getSingleProvider: async (req, res, next) => {
    try {
      const providerId = req.params.id;

      //check if the providerId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({ message: "Invalid provider ID" });
      }
      const post = await getProviderById(providerId);

      response(
        res,
        "provider",
        post,
        200,
        true,
        "provider Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providersController;
