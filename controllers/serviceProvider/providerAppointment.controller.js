const {
  appointmentSchema,
} = require("../../validations/appointment.validation.js");
const response = require("../../utils/response.util");
const {
  findProviderById,
} = require("../../services/serviceProvider.service.js");
const {
  createAppointment,
  isBooked,
  getUserAppointments,
  getAppointmentDetails,
  cancelAppointmentProvider,
  getProviderAppointments,
  getAppointmentDetailsProvider,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");

//USER APPOINTMENT CONTROLLER

const providerAppointmentController = {
  //GET ALL APPOINTMENTS
  getAppointmentsProvider: async (req, res, next) => {
    try {
      const appointments = await getProviderAppointments(req.user._id);

      //if there's no appointment respond with none found
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
      // Respond with the all appointment
      response(res, "appointments", appointments);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE APPOINTMENT DETAILS
  getAppointmentByIdProvider: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      const appointment = await getAppointmentDetailsProvider(appointmentId);

      if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
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

  // CANCEL APPOINTMENT
  cancelProviderAppointment: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      //Find Apoointment and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      const cancelledAppointment = await cancelAppointmentProvider(
        appointmentId
      );

      if (!cancelledAppointment) {
        res.status(404);
        throw new Error("Appointment not found or already cancelled");
      }

      // 🔔 Notify user of cancellation
      await postNotification({
        userId: cancelledAppointment.user._id,
        title: "Appointment Cancelled",
        message: `${req.user.fullName} cancelled your appointment for ${cancelledAppointment.date} at ${cancelledAppointment.timeSlot}`,
        type: "alert",
      });
      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: req.user._id,
        title: "You Cancelled Your Appointment",
        message: `You cancelled your appointment with ${cancelledAppointment.user.fullName} scheduled for ${cancelledAppointment.date} at ${cancelledAppointment.timeSlot}`,
        type: "alert",
      });

      response(res, "info", "Appointment cancelled successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerAppointmentController;
