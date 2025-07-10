const LabRequest = require("../models/LabRequest");

const labService = {
  // Check if Time slot is already booked
  isSlotTaken: async (data) => {
    return await LabRequest.findOne({
      serviceProvider: data.serviceProvider,
      date: data.date,
      timeSlot: data.timeSlot,
      status: { $ne: "cancelled" }, // Ignore cancelled slots
    });
  },
  // Create a new Lab Request
  createLabRequest: async (data) => {
    return await LabRequest.create(data);
  },

  //Get all user Lab Requests
  getUserLabRequests: async (userId) => {
    return await LabRequest.find({ user: userId })
      .populate("serviceProvider", "fullName specialization profilePhoto")
      .sort({ date: -1 });
  },

  //Get Single Lab Request details
  getLabRequestDetails: async (userId, labRequestId) => {
    return await LabRequest.findOne({
      _id: labRequestId,
      user: userId,
    }).populate("serviceProvider", "fullName specialization profilePhoto");
  },

  // Cancel Lab Request
  cancelUserLabRequest: async (userId, labRequestId) => {
    const labRequest = await LabRequest.findOneAndUpdate(
      { _id: labRequestId, user: userId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    );

    return labRequest;
  },
};

module.exports = labService;
