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

  //Get all Appointments Admin
  getAdminLabRequests: async (userId) => {
    return await LabRequest.find();
  },

  //Get all Lab Requests User
  getUserLabRequests: async (userId) => {
    return await LabRequest.find({ user: userId })
      .populate("serviceProvider", "fullName specialization profilePhoto")
      .sort({ date: -1 });
  },

  //Get all Lab Requests Provider
  getProviderLabRequests: async (providerId) => {
    return await LabRequest.find({ serviceProvider: providerId })
      .populate("user", "fullName email phoneNumber profilePhoto")
      .sort({ date: -1 });
  },

  //Get Single Appointment details Admin
  getAdminLabRequestDetails: async (labRequestId) => {
    const labRequest = await LabRequest.findOne({
      _id: labRequestId,
    })
      .populate("serviceProvider", "fullName specialization profilePhoto")
      .populate("user", "fullName email phoneNumber profilePhoto");

    return labRequest;
  },

  //Get Single Lab Request details User
  getUserLabRequestDetails: async (userId, labRequestId) => {
    return await LabRequest.findOne({
      _id: labRequestId,
      user: userId,
    }).populate("serviceProvider", "fullName specialization profilePhoto");
  },
  //Get Single Lab Request details Provider
  getProviderLabRequestDetails: async (providerId, labRequestId) => {
    return await LabRequest.findOne({
      _id: labRequestId,
      serviceProvider: providerId,
    }).populate("user", "fullName email phoneNumber profilePhoto");
  },

  //update Admin Lab Request Status
  updateAdminLabRequestStatus: async (id, { status }) => {
    return await LabRequest.findByIdAndUpdate(id, { status }, { new: true });
  },

  // Cancel Lab Request user
  cancelUserLabRequest: async (labRequestId) => {
    const labRequest = await LabRequest.findOneAndUpdate(
      { _id: labRequestId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("serviceProvider", "fullName");

    return labRequest;
  },
  // Confirm Lab Request Provider
  confirmProviderLabRequest: async (labRequestId) => {
    const labRequest = await LabRequest.findOneAndUpdate(
      { _id: labRequestId, status: { $nin: ["cancelled", "confirmed"] } },
      { status: "confirmed" },
      { new: true }
    ).populate("user", "fullName");

    return labRequest;
  },
  // Upload Lab Result Provider
  uploadProviderLabResult: async (labRequestId, labResult) => {
    const labRequest = await LabRequest.findOneAndUpdate(
      { _id: labRequestId, status: { $ne: "cancelled" } },
      { labResult: labResult },
      { new: true }
    ).populate("user", "fullName");

    return labRequest;
  },
  // Cancel Lab Request Provider
  cancelProviderLabRequest: async (labRequestId) => {
    const labRequest = await LabRequest.findOneAndUpdate(
      { _id: labRequestId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("user", "fullName");

    return labRequest;
  },
};

module.exports = labService;
