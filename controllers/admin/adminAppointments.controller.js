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
} = require("../../validations/admin.validation.js");
const Appointment = require("../../models/Appointment.js");

// ADMIN APPOINTMENT CONTROLLER

const adminAppointmentsController = {
  //GET ALL PROVIDERS
  getAppointmentsAdmin: async (req, res, next) => {
    try {
      const appointments = await getAdminAppointments();

      //if there's no appointments respond with none found
      if (!appointments || appointments.length === 0) {
        return response(
          res,
          "appointments",
          [],
          200,
          true,
          "No appointments found"
        );
      }
      // Respond with the all appointments
      response(
        res,
        "appointments",
        appointments,
        200,
        true,
        "Appointments Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE APPOINTMENT DETAILS
  getAppointmentByIdAdmin: async (req, res, next) => {
    try {
      const appointmentsId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentsId)) {
        return res.status(400).json({ message: "Invalid Appointment ID" });
      }
      const appointment = await getAdminAppointmentDetails(appointmentsId);

      //if there's no appointment respond with none found
      if (!appointment || appointment.length === 0) {
        return response(
          res,
          "appointment",
          [],
          200,
          true,
          "No appointment found"
        );
      }
      response(
        res,
        "appointment",
        appointment,
        200,
        true,
        "Appointment Retrieved Successfully."
      );
    } catch (error) {
      next(error);
    }
  },
  // UPDATE APPOINTMENT STATUS
  updateAppointmentStatusAdmin: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;
      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Appointment ID" });
      }

      const { error, value } = updateAppointmentStatusSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const appointment = await getAdminAppointmentDetails(appointmentId);

      //if there's no appointment respond with none found
      if (!appointment || appointment.length === 0) {
        return response(
          res,
          "appointment",
          [],
          200,
          true,
          "No appointment with this ID found"
        );
      }

      const { status } = value;

      const updatedAppointment = await updateAdminAppointmentStatus(
        appointmentId,
        {
          status,
        }
      );

      if (status === "cancelled") {
        // 🔔 Notify user of cancellation
        await postNotification({
          userId: updatedAppointment.user._id,
          title: "Appointment Cancelled by Admin",
          message: `An admin has cancelled your appointment scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}.`,
          type: "alert",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedAppointment.serviceProvider._id,
          title: "Appointment Cancelled by Admin",
          message: `An admin has cancelled the appointment with ${updatedAppointment.user.fullName}, which was scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}.`,
          type: "alert",
        });
      }
      if (status === "confirmed") {
        // 🔔 Notify user of confirmation
        await postNotification({
          userId: updatedAppointment.user._id,
          title: "Appointment Confirmed by Admin",
          message: `An admin has confirmed your appointment scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}.`,
          type: "info", // remember to change from "alert" to "info"
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedAppointment.serviceProvider._id,
          title: "Appointment Confirmed by Admin",
          message: `An admin has confirmed the appointment with ${updatedAppointment.user.fullName}, scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}.`,
          type: "info",
        });
      }
      if (status === "completed") {
        // 🔔 Notify user of completion
        await postNotification({
          userId: updatedAppointment.user._id,
          title: "Appointment Marked as Completed",
          message: `An admin has marked your appointment on ${updatedAppointment.date} at ${updatedAppointment.timeSlot} as completed.`,
          type: "info",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedAppointment.serviceProvider._id,
          title: "Appointment Marked as Completed",
          message: `An admin has marked the appointment with ${updatedAppointment.user.fullName}, scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}, as completed.`,
          type: "info",
        });
      } else {
        // 🔔 Notify user of status change to pending
        await postNotification({
          userId: updatedAppointment.user._id,
          title: "Appointment Marked as Pending",
          message: `An admin has marked your appointment on ${updatedAppointment.date} at ${updatedAppointment.timeSlot} as pending. Please wait for further updates.`,
          type: "info",
        });

        // 🔔 Notify service provider
        await postNotification({
          userId: updatedAppointment.serviceProvider._id,
          title: "Appointment Marked as Pending",
          message: `An admin has marked the appointment with ${updatedAppointment.user.fullName}, scheduled for ${updatedAppointment.date} at ${updatedAppointment.timeSlot}, as pending.`,
          type: "info",
        });
      }

      response(
        res,
        "updatedAppointment",
        updatedAppointment,
        200,
        true,
        "Appointment Status Updated Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
  // DELETE PROVIDER
  deleteAppointmentAdmin: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Appointment ID" });
      }

      const appointment = await getAdminAppointmentDetails(appointmentId);
      if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
      }

      const deletedAppointment = await Appointment.deleteOne({
        _id: appointmentId,
      });

      response(
        res,
        "Appointment",
        deletedAppointment,
        200,
        true,
        "Appointment Deleted Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminAppointmentsController;
