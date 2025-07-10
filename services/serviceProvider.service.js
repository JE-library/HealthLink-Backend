const ServiceProvider = require("../models/ServiceProvider");

const sPservice = {
  findProviderById: async (id) => {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      const error = new Error("Service provider not found");
      error.statusCode = 404;
      throw error;
    }
    return provider;
  },
};

module.exports = sPservice;
