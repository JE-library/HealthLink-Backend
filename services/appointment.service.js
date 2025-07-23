const Appointment = require("../models/Appointment");

const appointmentServices = {
  // Check if Time slot is already booked
  isBooked: async (data) => {
    return await Appointment.findOne(data);
  },

  // Create a new Appointment
  createAppointment: async (appointment) => {
    return await Appointment.create(appointment);
  },

  //Get all Appointments Admin
  getAdminAppointments: async (userId) => {
    return await Appointment.find()
      .populate("serviceProvider", "fullName")
      .populate("user", "fullName");
  },
  //Get all Appointments User
  getUserAppointments: async (userId) => {
    return await Appointment.find({ user: userId })
      .populate("serviceProvider", "fullName specialization profilePhoto")
      .sort({ date: -1 });
  },
  //Get all Appointments Provider
  getProviderAppointments: async (providerId) => {
    return await Appointment.find({ serviceProvider: providerId })
      .populate("user", "fullName email phoneNumber profilePhoto")
      .sort({ date: -1 });
  },

  //Get Single Appointment details Admin
  getAdminAppointmentDetails: async (appointmentId) => {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    })
      .populate("serviceProvider", "fullName specialization profilePhoto email phoneNumber")
      .populate("user", "fullName email phoneNumber profilePhoto");

    return appointment;
  },
  //Get Single Appointment details User
  getUserAppointmentDetails: async (appointmentId) => {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    }).populate("serviceProvider", "fullName specialization profilePhoto");

    return appointment;
  },
  //Get Single Appointment details Provider
  getProviderAppointmentDetails: async (appointmentId) => {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    }).populate("user", "fullName email phoneNumber profilePhoto");

    return appointment;
  },
  //update Admin Appointment Status
  updateAdminAppointmentStatus: async (id, { status }) => {
    return await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  },

  // Cancel Appointment User
  cancelUserAppointment: async (appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("serviceProvider", "fullname");
    return appointment;
  },
  // Confirm Appointment Provider
  confirmProviderAppointment: async (appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: appointmentId,
        status: { $nin: ["confirmed", "cancelled"] },
      },
      { status: "confirmed" },
      { new: true }
    ).populate("user", "fullName");

    return appointment;
  },
  // Cancel Appointment Provider
  cancelProviderAppointment: async (appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("user", "fullName");

    return appointment;
  },
};

module.exports = appointmentServices;
