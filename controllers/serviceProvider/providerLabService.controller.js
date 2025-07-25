const { default: mongoose } = require("mongoose");
const {
  getProviderLabRequests,
  getProviderLabRequestDetails,
  cancelProviderLabRequest,
  confirmProviderLabRequest,
  uploadProviderLabResult,
} = require("../../services/lab.service");
const { postNotification } = require("../../services/notification.service");
const response = require("../../utils/response.util");
const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");
const { labReqsultSchema } = require("../../validations/labRequest.validation");

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

  // CONFIRM LAB REQUEST
  confirmLabRequestProvider: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      //check if the labRequestId is a valid MongoDB ObjectId
      //Find Lab Request and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid labRequest ID" });
      }
      const confirmedLabRequest = await confirmProviderLabRequest(labRequestId);

      if (!confirmedLabRequest) {
        res.status(404);
        throw new Error("Lab Request not found or already cancelled");
      }

      // 🔔 Notify user of cancellation
      await postNotification({
        userId: confirmedLabRequest.user._id,
        title: "Lab Request Confirmed",
        message: `${req.user.fullName} Confirmed your Lab Request for ${confirmedLabRequest.date} at ${confirmedLabRequest.timeSlot}`,
        type: "info",
      });

      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: req.user._id,
        title: "You Confirmed a Lab Request",
        message: `You confirmed your Lab Request with ${confirmedLabRequest.user.fullName} scheduled for ${confirmedLabRequest.date} at ${confirmedLabRequest.timeSlot}`,
        type: "info",
      });

      response(res, "info", "Lab Request Confirmed successfully");
    } catch (error) {
      next(error);
    }
  },
  // UPLOAD LAB RESULT
  uploadLabResultProvider: async (req, res, next) => {
    try {
      const labRequestId = req.params.id;

      // validate lab result
      const { error, value } = labReqsultSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      //check if the labRequestId is a valid MongoDB ObjectId
      //Find Lab Request and update Status to Cancelled
      if (!mongoose.Types.ObjectId.isValid(labRequestId)) {
        return res.status(400).json({ message: "Invalid labRequest ID" });
      }

      //Check if lab Request Exists
      const labRequestExists = await getProviderLabRequestDetails(
        req.user._id,
        labRequestId
      );

      // if theres file url
      value.labResult = {
        url: value.labResult,
        public_id: "",
      };

      // if there's file
      // delete old file if theres any
      // handle upload new file
      if (labRequestExists.labResult.public_id) {
        await cloudinary.uploader.destroy(
          labRequestExists.labResult.public_id,
          { resource_type: "raw" }
        );
      }

      const file = req.file;
      if (file) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "healthlink/serviceProviders/labResults",
          resource_type: "raw",
        });
        value.labResult = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };

        //delete local file
        await fs.unlink(file.path);
      }
      const uploadedLabResult = await uploadProviderLabResult(
        labRequestId,
        value.labResult
      );

      if (!uploadedLabResult) {
        res.status(404);
        throw new Error("Lab Request not found or already cancelled");
      }

      // 🔔 Notify user of Result Upload
      await postNotification({
        userId: uploadedLabResult.user._id,
        title: "Lab Result Available",
        message: `${req.user.fullName} has uploaded your lab result for ${uploadedLabResult.date} at ${uploadedLabResult.timeSlot}.`,
        type: "info",
      });

      // 🔔 Send Notification to Service Provider
      await postNotification({
        userId: req.user._id,
        title: "Lab Result Uploaded",
        message: `You have successfully uploaded the lab result for ${uploadedLabResult.user.fullName}, scheduled on ${uploadedLabResult.date} at ${uploadedLabResult.timeSlot}.`,
        type: "info",
      });

      response(
        res,
        "LabResult",
        uploadedLabResult.labResult,
        200,
        true,
        "Lab Result Uploaded successfully"
      );
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
