const Appointment = require("../../models/Appointment");
const LabRequest = require("../../models/LabRequest");
const Post = require("../../models/Post");
const response = require("../../utils/response.util");

const providerOverviewController = {
  getOverviewProvider: async (req, res, next) => {
    try {
      const providerId = req.user._id;

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
        Appointment.countDocuments({ serviceProvider: providerId }),
        Appointment.countDocuments({
          serviceProvider: providerId,
          status: "pending",
        }),
        Appointment.countDocuments({
          serviceProvider: providerId,
          status: "cancelled",
        }),
        Appointment.countDocuments({
          serviceProvider: providerId,
          status: "confirmed",
        }),
        Appointment.countDocuments({
          serviceProvider: providerId,
          status: "completed",
        }),
        //lab Requests
        LabRequest.countDocuments({ serviceProvider: providerId }),
        LabRequest.countDocuments({
          serviceProvider: providerId,
          status: "pending",
        }),
        LabRequest.countDocuments({
          serviceProvider: providerId,
          status: "cancelled",
        }),
        LabRequest.countDocuments({
          serviceProvider: providerId,
          status: "confirmed",
        }),
        LabRequest.countDocuments({
          serviceProvider: providerId,
          status: "completed",
        }),
        //posts
        Post.countDocuments({ author: providerId }),
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
        posts: {
          total: totalPosts,
        },
      };

      return response(
        res,
        "dashboardStats",
        stats,
        200,
        true,
        "Service Provider overview stats fetched"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerOverviewController;
