const response = require("../../utils/response.util.js");
const ServiceProvider = require("../../models/ServiceProvider.js");
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
const {
  getAdminProviders,
  getProviderById,
  getAdminProviderById,
  updateAdminProviderStatus,
} = require("../../services/serviceProvider.service.js");
const Notification = require("../../models/Notification.js");
const {
  updateProviderStatusSchema,
} = require("../../validations/admin.validation.js");

// ADMIN PROVIDERS CONTROLLER

const adminProvidersController = {
  //GET ALL PROVIDERS
  getProvidersAdmin: async (req, res, next) => {
    try {
      const providers = await getAdminProviders();

      //if there's no providers respond with none found
      if (!providers || providers.length === 0) {
        return response(res, "providers", [], 200, true, "No providers found");
      }
      // Respond with the all providers
      response(
        res,
        "providers",
        providers,
        200,
        true,
        "providers Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE PROVIDER DETAILS
  getProviderDetailsAdmin: async (req, res, next) => {
    try {
      const providerId = req.params.id;

      //check if the providerId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({ message: "Invalid Provider ID" });
      }
      const provider = await getAdminProviderById(providerId);

      //if there's no provider respond with none found
      if (!provider || provider.length === 0) {
        return response(res, "provider", [], 200, true, "No provider found");
      }
      response(
        res,
        "provider",
        provider,
        200,
        true,
        "provider Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },
  // UPDATE PROVIDER STATUS
  updateProviderStatusAdmin: async (req, res, next) => {
    try {
      const providerId = req.params.id;
      //check if the usersId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({ message: "Invalid Provider ID" });
      }

      const { error, value } = updateProviderStatusSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const provider = await getAdminProviderById(providerId);

      //if there's no provider respond with none found
      if (!provider || provider.length === 0) {
        return response(
          res,
          "provider",
          [],
          200,
          true,
          "No provider with this ID found"
        );
      }

      const { status, message } = value;

      const updatedProvider = await updateAdminProviderStatus(providerId, {
        status,
        message,
      });

      response(
        res,
        "provider",
        {
          fullName: updatedProvider.fullName,
          email: updatedProvider.email,
          specialization: updatedProvider.specialization,
          status: updatedProvider.status,
          note: updatedProvider.note,
        },
        200,
        true,
        "Provider Status Updated Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
  // DELETE PROVIDER
  deleteProviderAdmin: async (req, res, next) => {
    try {
      const providerId = req.params.id;

      //check if the usersId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({ message: "Invalid Provider ID" });
      }

      const provider = await getAdminProviderById(providerId);

      //delete Avatar from cloudniary if any
      if (provider.profilePhoto.public_id) {
        await cloudinary.uploader.destroy(provider.profilePhoto.public_id);
      }
      //delete Certifications if any
      const certs = provider.certifications;
      for (let i = 0; i < certs.length; i++) {
        try {
          const certId = certs[i].public_id;
          console.log(`DELETING CERT ${i}`, certId);
          await cloudinary.uploader.destroy(certId, { resource_type: "raw" });
        } catch (error) {
          console.log(`FAILED TO DELETE CERT${i}`);
        }
      }
      //delete providers notifications
      await Notification.deleteMany({ user: provider._id });

      const deletedProvider = await ServiceProvider.deleteOne({
        _id: providerId,
      });

      if (!provider) {
        res.status(404);
        throw new Error("Provider not found");
      }
      response(
        res,
        "provider",
        deletedProvider,
        200,
        true,
        "Provider Deleted Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminProvidersController;
