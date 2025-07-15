const User = require("../../models/User");
const ServiceProvider = require("../../models/ServiceProvider");
const Appointment = require("../../models/Appointment");
// const AmbulanceRequest = require("../../models/AmbulanceRequest");
const LabRequest = require("../../models/LabRequest");
const Post = require("../../models/Post");
const response = require("../../utils/response.util");

const adminOverviewController = {
  getOverviewAdmin: async (req, res, next) => {
    try {
      const [
        //users
        totalUsers,
        //providers
        totalProviders,
        pendingProviders,
        rejectedProviders,
        approvedProviders,
        bannedProviders,
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
        // users
        User.countDocuments(),
        // providers
        ServiceProvider.countDocuments(),
        ServiceProvider.countDocuments({ status: "pending" }),
        ServiceProvider.countDocuments({ status: "rejected" }),
        ServiceProvider.countDocuments({ status: "approved" }),
        ServiceProvider.countDocuments({ status: "banned" }),
        // appointments
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "pending" }),
        Appointment.countDocuments({ status: "cancelled" }),
        Appointment.countDocuments({ status: "confirmed" }),
        Appointment.countDocuments({ status: "completed" }),
        //lab Requests
        LabRequest.countDocuments(),
        LabRequest.countDocuments({ status: "pending" }),
        LabRequest.countDocuments({ status: "cancelled" }),
        LabRequest.countDocuments({ status: "confirmed" }),
        LabRequest.countDocuments({ status: "completed" }),
        //posts
        Post.countDocuments(),
      ]);

      const stats = {
        users: {
          total: totalUsers,
        },
        providers: {
          total: totalProviders,
          pending: pendingProviders,
          rejected: rejectedProviders,
          approved: approvedProviders,
          banned: bannedProviders,
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          cancelled: cancelledAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
        },
        // ambulanceRequests: totalAmbulanceRequests,
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
        "Admin overview stats fetched"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminOverviewController;
