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

  //Get Single Appointment details User
  getAppointmentDetailsUser: async (appointmentId) => {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    }).populate("serviceProvider", "fullName specialization profilePhoto");

    return appointment;
  },
  //Get Single Appointment details Provider
  getAppointmentDetailsProvider: async (appointmentId) => {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    }).populate("user", "fullName email phoneNumber profilePhoto");

    return appointment;
  },

  // Cancel Appointment User
  cancelAppointmentUser: async (appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("serviceProvider", "fullname");
    return appointment;
  },
  // Cancel Appointment Provider
  cancelAppointmentProvider: async (appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    ).populate("user", "fullName");

    return appointment;
  },
};

module.exports = appointmentServices;
