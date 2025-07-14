const response = require("../../utils/response.util.js");
const ServiceProvider = require("../../models/ServiceProvider.js");
const cloudinary = require("../../config/cloudinary.config.js");
const {
  getProviderAppointments,
  cancelProviderAppointment,
  getProviderAppointmentDetails,
  confirmProviderAppointment,
  getAdminAppointmentDetails,
  updateAdminAppointmentStatus,
  getAdminAppointments,
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
  updateAppointmentStatusSchema,
  updateLabRequestStatusSchema,
} = require("../../validations/admin.validation.js");
const Appointment = require("../../models/Appointment.js");
const {
  getAdminLabRequests,
  getAdminLabRequestDetails,
  updateAdminLabRequestStatus,
} = require("../../services/lab.service.js");
const LabRequest = require("../../models/LabRequest.js");

// ADMIN LAB SERVICES CONTROLLER

const adminLabServicesController = {
  //GET ALL LAB SERVICES
  getLabRequestsAdmin: async (req, res, next) => {
    try {
      const LabRequests = await getAdminLabRequests();

      //if there's no LabRequests respond with none found
      if (!LabRequests || LabRequests.length === 0) {
        return response(
          res,
          "LabRequests",
          [],
          200,
          true,
          "No Lab Requests found"
        );
      }
      // Respond with the LabRequests
      response(
        res,
        "LabRequests",
        LabRequests,
        200,
        true,
        "Lab Requests Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE LAB REQUEST DETAILS
  getLabRequestByIdAdmin: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //check if the labRequestId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid Lab Request ID" });
      }
      const labRequest = await getAdminLabRequestDetails(labRequestId);

      //if there's no labRequest respond with none found
      if (!labRequest || labRequest.length === 0) {
        return response(
          res,
          "labRequest",
          [],
          200,
          true,
          "No Lab Request found"
        );
      }
      response(
        res,
        "labRequest",
        labRequest,
        200,
        true,
        "Lab Request Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },

  // UPDATE LAB REQUEST STATUS
  updateLabRequestStatusAdmin: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;
      //check if the labRequestId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid Lab Request ID" });
      }

      const { error, value } = updateLabRequestStatusSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const labRequest = await getAdminLabRequestDetails(labRequestId);

      //if there's no Lab Request respond with none found
      if (!labRequest || labRequest.length === 0) {
        return response(
          res,
          "labRequest",
          [],
          200,
          true,
          "No labRequest with this ID found"
        );
      }

      const { status } = value;

      const updatedlabRequest = await updateAdminLabRequestStatus(
        labRequestId,
        {
          status,
        }
      );

      if (status === "cancelled") {
        // 🔔 Notify user of cancellation
        await postNotification({
          userId: updatedlabRequest.user._id,
          title: "Lab Request Cancelled by Admin",
          message: `An admin has cancelled your Lab Request scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}.`,
          type: "alert",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedlabRequest.serviceProvider._id,
          title: "Lab Request Cancelled by Admin",
          message: `An admin has cancelled the Lab Request with ${updatedlabRequest.user.fullName}, which was scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}.`,
          type: "alert",
        });
      }
      if (status === "confirmed") {
        // 🔔 Notify user of confirmation
        await postNotification({
          userId: updatedlabRequest.user._id,
          title: "Lab Request Confirmed by Admin",
          message: `An admin has confirmed your Lab Request scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}.`,
          type: "info", // remember to change from "alert" to "info"
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedlabRequest.serviceProvider._id,
          title: "Lab Request Confirmed by Admin",
          message: `An admin has confirmed the Lab Request with ${updatedlabRequest.user.fullName}, scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}.`,
          type: "info",
        });
      }
      if (status === "completed") {
        // 🔔 Notify user of completion
        await postNotification({
          userId: updatedlabRequest.user._id,
          title: "Lab Request Marked as Completed",
          message: `An admin has marked your Lab Request on ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot} as completed.`,
          type: "info",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedlabRequest.serviceProvider._id,
          title: "Lab Request Marked as Completed",
          message: `An admin has marked the Lab Request with ${updatedlabRequest.user.fullName}, scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}, as completed.`,
          type: "info",
        });
      } else {
        // 🔔 Notify user of status change to pending
        await postNotification({
          userId: updatedlabRequest.user._id,
          title: "Lab Request Marked as Pending",
          message: `An admin has marked your Lab Request on ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot} as pending. Please wait for further updates.`,
          type: "info",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedlabRequest.serviceProvider._id,
          title: "Lab Request Marked as Pending",
          message: `An admin has marked the Lab Request with ${updatedlabRequest.user.fullName}, scheduled for ${updatedlabRequest.date} at ${updatedlabRequest.timeSlot}, as pending.`,
          type: "info",
        });
      }

      response(
        res,
        "updatedlabRequest",
        updatedlabRequest,
        200,
        true,
        "Lab Request Status Updated Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
  // DELETE PROVIDER
  deleteLabRequestAdmin: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //check if the labRequestId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid lab RequestId ID" });
      }

      const labRequest = await getAdminLabRequestDetails(labRequestId);
      if (!labRequest) {
        res.status(404);
        throw new Error("Lab Request not found");
      }

      //delete uploaded result if any
      await cloudinary.uploader.destroy(labRequest._id, {
        resource_type: "raw",
      });

      const deletedLabRequest = await LabRequest.deleteOne({
        _id: labRequestId,
      });

      response(
        res,
        "LabRequest",
        deletedLabRequest,
        200,
        true,
        "Lab Request Deleted Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminLabServicesController;
