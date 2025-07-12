const { default: mongoose } = require("mongoose");
const {
  getProviderLabRequests,
  getProviderLabRequestDetails,
  cancelProviderLabRequest,
} = require("../../services/lab.service");
const { postNotification } = require("../../services/notification.service");
const response = require("../../utils/response.util");

const providerLabRequestController = {
  //GET ALL LAB REQUESTS
  getLabRequestsProvider: async (req, res, next) => {
    try {
      const LabRequest = await getProviderLabRequests(req.user._id);

      //if there's no Lab Request respond with none found
      if (!LabRequest || LabRequest.length === 0) {
        return response(
          res,
          "LabRequests",
          [],
          200,
          true,
          `No Lab Request found for ${req.user.fullName}`
        );
      }
      // Respond with the Lab Requests
      response(res, "LabRequest", LabRequest);
    } catch (error) {
      next(error);
    }
  },

  // GET LAB REQUEST DETAILS
  getLabRequestByIdProvider: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //check if the labRequestId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid labRequest ID" });
      }

      const labRequest = await getProviderLabRequestDetails(
        req.user._id,
        labRequestId
      );

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
  cancelLabRequestProvider: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //check if the labRequestId is a valid MongoDB ObjectId
      //Find Lab Request and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid labRequest ID" });
      }
      const cancelledLabRequest = await cancelProviderLabRequest(labRequestId);

      if (!cancelledLabRequest) {
        res.status(404);
        throw new Error("Lab Request not found or already cancelled");
      }

      // 🔔 Notify user of cancellation
      await postNotification({
        userId: cancelledLabRequest.user._id,
        title: "Lab Request Cancelled",
        message: `${req.user.fullName} cancelled your Lab Request for ${cancelledLabRequest.date} at ${cancelledLabRequest.timeSlot}`,
        type: "alert",
      });

      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: req.user._id,
        title: "You Cancelled Your Lab Request",
        message: `You cancelled your Lab Request with ${cancelledLabRequest.user.fullName} scheduled for ${cancelledLabRequest.date} at ${cancelledLabRequest.timeSlot}`,
        type: "alert",
      });

      response(res, "info", "Lab Request cancelled successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerLabRequestController;
