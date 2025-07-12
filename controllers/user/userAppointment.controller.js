const {
  appointmentSchema,
} = require("../../validations/appointment.validation.js");
const response = require("../../utils/response.util");
const {
  getProviderById,
} = require("../../services/serviceProvider.service.js");
const {
  createAppointment,
  isBooked,
  getUserAppointments,
  getAppointmentDetailsUser,
  cancelAppointmentUser,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");

//USER APPOINTMENT CONTROLLER

const userAppointmentController = {
  //Book Appointment
  bookAppointment: async (req, res, next) => {
    try {
      // Validate input
      const { error, value } = appointmentSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { date, timeSlot, mode, notes, serviceProviderId } = value;

      // Ensure the service provider exists
      //check if the serviceProviderId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(serviceProviderId)) {
        return res.status(400).json({ message: "Invalid Service Provider ID" });
      }
      const providerExists = await getProviderById(serviceProviderId);

      // Check if Time slot is already booked
      const slotTaken = await isBooked({
        serviceProvider: serviceProviderId,
        date,
        timeSlot,
        status: { $ne: "cancelled" },
      });
      if (slotTaken) {
        res.status(400);
        throw new Error(
          "This time slot is already booked for the selected provider."
        );
      }

      // Create appointment
      const appointment = await createAppointment({
        user: req.user._id,
        serviceProvider: serviceProviderId,
        date,
        timeSlot,
        mode,
        notes,
      });

      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: providerExists._id,
        title: "New Appointment Booked",
        message: `You have a new appointment booked by ${req.user.fullName} for ${date} at ${timeSlot}`,
        type: "info",
      });
      // 🔔 Send Notification to User
      await postNotification({
        userId: req.user._id,
        title: "Appointment Booked",
        message: `You have booked a new appointment with ${providerExists.fullName} for ${date} at ${timeSlot}`,
        type: "info",
      });

      // Respond with the created appointment
      response(res, "appointment", appointment, 201);
    } catch (err) {
      next(err);
    }
  },

  //GET ALL APPOINTMENTS
  getAppointmentsUser: async (req, res, next) => {
    try {
      const appointments = await getUserAppointments(req.user._id);

      //if there's no appointment respond with none found
      if (!appointments || appointments.length === 0) {
        return response(
          res,
          "appointments",
          [],
          200,
          true,
          `No Lab Request found for ${req.user.fullName}`
        );
      }
      // Respond with the all appointment
      response(res, "appointments", appointments);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE APPOINTMENT DETAILS
  getAppointmentByIdUser: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Appointment ID" });
      }

      const appointment = await getAppointmentDetailsUser(appointmentId);
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
  cancelAppointmentUser: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      //Find Apoointment and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      const cancelledAppointment = await cancelAppointmentUser(appointmentId);

      if (!cancelledAppointment) {
        res.status(404);
        throw new Error("Appointment not found or already cancelled");
      }

      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: cancelledAppointment.serviceProvider,
        title: "Appointment Cancelled",
        message: `${req.user.fullName} cancelled their appointment for ${cancelledAppointment.date} at ${cancelledAppointment.timeSlot}`,
        type: "alert",
      });
      // 🔔 Send Notification to User
      await postNotification({
        userId: req.user._id,
        title: "Your Appointment was Cancelled",
        message: `You cancelled your appointment scheduled for ${cancelledAppointment.date} at ${cancelledAppointment.timeSlot}`,
        type: "alert",
      });

      response(res, "info", "Appointment cancelled successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userAppointmentController;
