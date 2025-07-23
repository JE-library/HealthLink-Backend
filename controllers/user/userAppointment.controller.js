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
  cancelUserAppointment,
  getUserAppointmentDetails,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");
const Appointment = require("../../models/Appointment.js");
const Conversation = require("../../models/Conversation.js");
const Message = require("../../models/Message.js");

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

      const { date, timeSlot, mode, notes } = value;

      //check if the serviceProviderId is a valid MongoDB ObjectId
      // Ensure the service provider exists
      const serviceProviderId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(serviceProviderId)) {
        return res.status(400).json({ message: "Invalid Service Provider ID" });
      }

      const providerExists = await getProviderById(serviceProviderId);

      // Check if Time slot is already booked
      const slotTaken = await isBooked({
        serviceProvider: serviceProviderId,
        date: new Date(date),
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

      const appointment = await getUserAppointmentDetails(appointmentId);
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
      const cancelledAppointment = await cancelUserAppointment(appointmentId);

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
  // CREATE A CONVERSATION
  createConversationUser: async (req, res, next) => {
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
        const messages = await Message.find(
          {
            conversationId: conversationExists._id,
          },
          { message: 1, createdAt: 1, senderModel: 1 }
        );
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
      const messages = await Message.find(
        {
          conversationId: newConversation._id,
        },
        { message: 1, createdAt: 1, senderModel: 1 }
      );
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
  getConversationsUser: async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        user: req.user._id,
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
  getConversationByIdUser: async (req, res, next) => {
    try {
      const conversationId = req.params.id;

      //check if the conversationId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({ message: "Invalid Conversation ID" });
      }
      //Get Conversation
      //Get Messages
      const conversation = await Conversation.findById(conversationId);
      const messages = await Message.find(
        { conversationId },
        { message: 1, createdAt: 1, senderModel: 1 }
      );
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

module.exports = userAppointmentController;
