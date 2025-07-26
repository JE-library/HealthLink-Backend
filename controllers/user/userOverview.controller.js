const Appointment = require("../../models/Appointment");
const LabRequest = require("../../models/LabRequest");
const Post = require("../../models/Post");
const response = require("../../utils/response.util");

const userOverviewController = {
  getOverviewUser: async (req, res, next) => {
    try {
      const userId = req.user._id;

      const [
        //appointments
        totalAppointments,
        pendingAppointments,
        cancelledAppointments,
        confirmedAppointments,
        completedAppointments,
        // lab requests
        totalLabRequests,
        pendingLabRequests,
        cancelledLabRequests,
        confirmedLabRequests,
        completedLabRequests,
        // posts
        totalPosts,
      ] = await Promise.all([
        // appointments
        Appointment.countDocuments({ user: userId }),
        Appointment.countDocuments({
          user: userId,
          status: "pending",
        }),
        Appointment.countDocuments({
          user: userId,
          status: "cancelled",
        }),
        Appointment.countDocuments({
          user: userId,
          status: "confirmed",
        }),
        Appointment.countDocuments({
          user: userId,
          status: "completed",
        }),
        //lab Requests
        LabRequest.countDocuments({ user: userId }),
        LabRequest.countDocuments({
          user: userId,
          status: "pending",
        }),
        LabRequest.countDocuments({
          user: userId,
          status: "cancelled",
        }),
        LabRequest.countDocuments({
          user: userId,
          status: "confirmed",
        }),
        LabRequest.countDocuments({
          user: userId,
          status: "completed",
        }),
      ]);

      const stats = {
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          cancelled: cancelledAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
        },
        labRequests: {
          total: totalLabRequests,
          pending: pendingLabRequests,
          cancelled: cancelledLabRequests,
          confirmed: confirmedLabRequests,
          completed: completedLabRequests,
        },
      };

      return response(
        res,
        "dashboardStats",
        stats,
        200,
        true,
        "User overview stats fetched"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userOverviewController;
