const {
  createLabRequest,
  isSlotTaken,
  getUserLabRequests,
  getLabRequestDetails,
  cancelUserLabRequest,
} = require("../../services/lab.service");
const { postNotification } = require("../../services/notification.service");
const { findProviderById } = require("../../services/serviceProvider.service");
const response = require("../../utils/response.util");
const { labRequestSchema } = require("../../validations/labRequest.validation");

const userLabRequestController = {
  bookLabService: async (req, res, next) => {
    try {
      const { error, value } = labRequestSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { serviceProviderId, tests, date, timeSlot, notes } = value;

      // Check if Time slot is already booked
      const slotTaken = await isSlotTaken({
        serviceProvider: serviceProviderId,
        date,
        timeSlot,
      });

      if (slotTaken) {
        res.status(400);
        throw new Error(
          "This time slot is already booked for the selected provider."
        );
      }

      // Ensure the service provider exists
      //   const providerExists = await findProviderById(serviceProviderId);

      const labRequest = await createLabRequest({
        user: req.user._id,
        serviceProvider: serviceProviderId,
        tests,
        date,
        timeSlot,
        notes,
      });

      // 🔔 Send notification to service provider
      await postNotification({
        userId: serviceProviderId,
        title: "New Lab Request",
        message: `New lab request from ${req.user.fullName} scheduled for ${date} at ${timeSlot}.`,
        type: "info",
      });

      // 🔔 Send notification to user
      await postNotification({
        userId: req.user._id,
        title: "Lab Request Booked",
        message: `You booked a lab request for ${date} at ${timeSlot}.`,
        type: "info",
      });

      response(res, "labRequest", labRequest, 201);
    } catch (error) {
      next(error);
    }
  },

  //GET ALL LAB REQUESTS
  getLabRequestsUser: async (req, res, next) => {
    try {
      const LabRequest = await getUserLabRequests(req.user._id);

      //if there's no Lab Request respond with none found
      if (!LabRequest || LabRequest.length === 0) {
        return response(
          res,
          "LabRequests",
          [],
          200,
          true,
          "No Lab Request found"
        );
      }
      // Respond with the Lab Requests
      response(res, "LabRequest", LabRequest);
    } catch (error) {
      next(error);
    }
  },

  // GET LAB REQUEST DETAILS
  getLabRequestById: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      const labRequest = await getLabRequestDetails(req.user._id, labRequestId);

      if (!labRequest) {
        res.status(404);
        throw new Error("LabRequest not found");
      }

      response(res, "LabRequest", labRequest);
    } catch (error) {
      next(error);
    }
  },

  // CANCEL  LAB REQUEST
  cancelLabRequest: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //Find Apoointment and update Status to Cancelled
      const cancelledlabRequestId = await cancelUserLabRequest(
        req.user._id,
        labRequestId
      );

      if (!cancelledlabRequestId) {
        res.status(404);
        throw new Error("Lab Request not found or already cancelled");
      }

      // 🔔 Notify provider of cancellation
      await postNotification({
        userId: cancelledlabRequestId.serviceProvider,
        title: "Lab Request Cancelled",
        message: `${req.user.fullName} cancelled their lab request scheduled for ${cancelledlabRequestId.date} at ${cancelledlabRequestId.timeSlot}.`,
        type: "alert",
      });

      // 🔔 Notify user of cancellation
      await postNotification({
        userId: req.user._id,
        title: "Your Lab Request was Cancelled",
        message: `You cancelled your lab request for ${cancelledlabRequestId.date} at ${cancelledlabRequestId.timeSlot}.`,
        type: "alert",
      });

      response(res, "info", "Lab Request cancelled successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userLabRequestController;
