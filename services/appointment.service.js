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

  //Get all user Appointments
  getUserAppointments: async (userId) => {
    return await Appointment.find({ user: userId })
      .populate("serviceProvider", "fullName specialization profilePhoto")
      .sort({ date: -1 });
  },

  //Get Single Appointment details
  getAppointmentDetails: async (userId, appointmentId) => {
    return await Appointment.findOne({
      _id: appointmentId,
      user: userId,
    }).populate("serviceProvider", "fullName specialization profilePhoto");
  },

  // Cancel Appointment User
  cancelUserAppointment: async (userId, appointmentId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, user: userId, status: { $ne: "cancelled" } },
      { status: "cancelled" },
      { new: true }
    );

    return appointment;
  },
};

module.exports = appointmentServices;
