const bcrypt = require("bcryptjs");
const { changePasswordSchema } = require("../../validations/user.validation");
const response = require("../../utils/response.util");

const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");
const {
  getProviderById,
  updateServiceProvider,
} = require("../../services/serviceProvider.service");
const {
  updateProviderSchema,
  updateProviderAvailabilitySchema,
} = require("../../validations/serviceProvider.validation");
const ServiceProvider = require("../../models/ServiceProvider");

//PROVIDER PROFILE CONTROLLER

const providerProfileController = {
  //GETTING PROVIDER PROFILE
  getProvider: async (req, res, next) => {
    try {
      const provider = await getProviderById(req.user._id);

      response(res, "provider", provider);
    } catch (error) {
      next(error);
    }
  },

  //UPDATE PROVIDER PROFILE
  updateProvider: async (req, res, next) => {
    try {
      const { error, value } = updateProviderSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const providerId = req.user._id;
      const existingProvider = await getProviderById(providerId);

      // Handle profile photo if uploaded
      if (req.file) {
        // Delete old photo from Cloudinary if it exists
        if (existingProvider.profilePhoto.public_id) {
          await cloudinary.uploader.destroy(
            existingProvider.profilePhoto.public_id
          );
        }
        // Upload new photo
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "healthlink/serviceProviders/avatars",
        });

        // Delete the local file
        fs.unlink(req.file.path);
        //Add Image data to
        value.profilePhoto = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      }

      const updatedProvider = await updateServiceProvider(req.user._id, value);

      response(res, "Service Provider", updatedProvider);
    } catch (error) {
      next(error);
    }
  },
  //UPDATE PROVIDER AVAILABILITY
  updateAvailabilityProvider: async (req, res, next) => {
    try {
      const { error, value } = updateProviderAvailabilitySchema.validate(
        req.body
      );
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const providerId = req.user._id;
      const existingProvider = await getProviderById(providerId);

      const updatedProvider = await updateServiceProvider(providerId, {
        availability: value.availability,
      });

      return response(
        res,
        "providerTimeSlots",
        updatedProvider.availability,
        200,
        true,
        "Time slots updated successfully"
      );
    } catch (err) {
      next(err);
    }
  },

  // TOGGLE AVAILABILITY STATUS
  toggleAvailabilityProvider: async (req, res, next) => {
    try {
      const matchedProvider = await getProviderById(req.user._id);

      const newStatus = !matchedProvider.isAvailable;
      //toggle available status
      const updatedProvider = await ServiceProvider.findByIdAndUpdate(
        req.user._id,
        { isAvailable: newStatus },
        { new: true }
      ).select("-password");

      response(
        res,
        "serviceProviderAvailability",
        updatedProvider.isAvailable,
        200,
        true,
        `Availability updated to ${updatedProvider.isAvailable}`
      );
    } catch (error) {
      next(error);
    }
  },

  //CHANGE USER PASSWORD
  changePasswordProvider: async (req, res, next) => {
    try {
      // Validate input
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { currentPassword, newPassword } = value;

      const matchedProvider = await getProviderById(req.user._id);

      const isMatch = await bcrypt.compare(
        currentPassword,
        matchedProvider.password
      );
      if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateServiceProvider(req.user._id, { password: hashedPassword });

      response(res, "message", "Password updated successfully");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = providerProfileController;
