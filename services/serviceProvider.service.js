const ServiceProvider = require("../models/ServiceProvider");

const sPservice = {
  getProviderById: async (id) => {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      const error = new Error("Service provider not found");
      error.statusCode = 404;
      throw error;
    }
    return provider;
  },
  // Create new Service Provider
  createServiceProvider: (providerData) => {
    return ServiceProvider.create(providerData);
  },

  // Update Provider
  updateServiceProvider: async (id, updateData) => {
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    ).select("-password");

    if (!updatedProvider) {
      res.status(404);
      throw new Error("Provider not found");
    }
    return updatedProvider;
  },
};

module.exports = sPservice;
