const response = require("../../utils/response.util");
const {
  getProviderAppointments,
  cancelProviderAppointment,
  getProviderAppointmentDetails,
  confirmProviderAppointment,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");
const Conversation = require("../../models/Conversation.js");
const Appointment = require("../../models/Appointment.js");
const Message = require("../../models/Message.js");

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
      const appointment = await getProviderAppointmentDetails(appointmentId);

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

  // CONFIRM APPOINTMENT
  confirmAppointmentProvider: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      //Find Apoointment and update Status to Confirmed
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      const confirmedAppointment = await confirmProviderAppointment(
        appointmentId
      );

      if (!confirmedAppointment) {
        res.status(404);
        throw new Error("Appointment not found or already confirmed");
      }

      // 🔔 Notify user of cancellation
      await postNotification({
        userId: confirmedAppointment.user._id,
        title: "Appointment Confirmed",
        message: `${req.user.fullName} confirmed your appointment for ${confirmedAppointment.date} at ${confirmedAppointment.timeSlot}`,
        type: "alert",
      });
      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: req.user._id,
        title: "You Confirmed an Appointment",
        message: `You Confirmed your appointment with ${confirmedAppointment.user.fullName} scheduled for ${confirmedAppointment.date} at ${confirmedAppointment.timeSlot}`,
        type: "alert",
      });

      response(res, "info", "Appointment Confirmed successfully");
    } catch (error) {
      next(error);
    }
  },
  // CANCEL APPOINTMENT
  cancelAppointmentProvider: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      //Find Apoointment and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      const cancelledAppointment = await cancelProviderAppointment(
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
  // CREATE A CONVERSATION
  createConversationProvider: async (req, res, next) => {
    try {
      const appointmentId = req.params.id;

      //check if the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid Apoointment ID" });
      }
      //Get Appointment
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
      }
      //Extract user and provider Id
      const userId = appointment.user;
      const providerId = appointment.serviceProvider;

      //check if converstion already exists
      const conversationExists = await Conversation.findOne({
        user: userId,
        serviceProvider: providerId,
      });

      if (conversationExists) {
        // Respond with Existing Converation
        const messages = await Message.find({
          conversationId: conversationExists._id,
        });
        return response(res, "conversation", {
          conversation: conversationExists,
          messages,
        });
      }
      //Create New Conversation
      const newConversation = await Conversation.create({
        user: userId,
        serviceProvider: providerId,
      });
      const messages = await Message.find({
        conversationId: newConversation._id,
      });
      //respond with New Converstion
      response(res, "conversation", {
        conversation: newConversation,
        messages,
      });
    } catch (error) {
      next(error);
    }
  },
  // GET ALL CONVERSATIONS
  getConversationsProvider: async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        serviceProvider: req.user._id,
      });

      //if there's no conversations respond with none found
      if (!conversations || conversations.length === 0) {
        return response(
          res,
          "converstion",
          [],
          200,
          true,
          "No converstion found"
        );
      }
      // Respond with the all conversations
      response(res, "conversations", conversations);
    } catch (error) {
      next(error);
    }
  },
  // GET A SINGLE CONVERSATION
  getConversationByIdProvider: async (req, res, next) => {
    try {
      const conversationId = req.params.id;

      //check if the conversationId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({ message: "Invalid Conversation ID" });
      }
      //Get Conversation
      //Get Messages
      const conversation = await Conversation.findById(conversationId);
      const messages = await Message.find({ conversationId });
      //if there's no conversations respond with Error
      if (!conversation) {
        res.status(404);
        throw new Error("conversation not found");
      }
      // Respond with the all conversations
      response(res, "conversation", { conversation, messages });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerAppointmentController;
