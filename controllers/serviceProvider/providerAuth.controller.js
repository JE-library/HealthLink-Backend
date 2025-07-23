const bcrypt = require("bcryptjs");
const ServiceProvider = require("../../models/ServiceProvider");
const {
  registerServiceProviderSchema,
} = require("../../validations/serviceProvider.validation");
const response = require("../../utils/response.util");
const { loginSchema } = require("../../validations/login.validation.js");
const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");
const {
  createServiceProvider,
} = require("../../services/serviceProvider.service");
const generateToken = require("../../utils/jwt.util.js");
const sendEmail = require("../../utils/sendMail.utils.js");

const providerAuthController = {
  registerProvider: async (req, res, next) => {
    try {
      // Parse fields
      const {
        fullName,
        email,
        password,
        phoneNumber,
        gender,
        dateOfBirth,
        address,
        professionalTitle,
        specialization,
        experienceYears,
        labTestsOffered,
        bio,
        consultationModes,
      } = req.body;

      // Validate body
      const { error } = registerServiceProviderSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return response(
          res,
          "errors",
          error.details,
          400,
          false,
          "Validation failed"
        );
      }

      // Check for existing provider
      const existing = await ServiceProvider.findOne({ email });
      if (existing) {
        return response(
          res,
          null,
          null,
          409,
          false,
          "User with this email already exists"
        );
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload profile photo if provided
      let profilePhoto = {};

      if (req.files?.profilePhoto?.length) {
        const file = req.files.profilePhoto[0];

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "healthlink/serviceProviders/avatars",
        });

        profilePhoto = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        // Delete the local file after successful upload
        await fs.unlink(file.path);
      }

      // 5. Handle certifications
      const certifications = [];

      if (req.files?.certifications?.length) {
        for (let i = 0; i < req.files.certifications.length; i++) {
          //get each Certificate
          const file = req.files.certifications[i];
          try {
            //upload each Certificate
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "healthlink/serviceProviders/certifications",
              resource_type: "raw", // Default is image.
            });
            // push each cert to  Certificate array
            certifications.push({
              certificate: result.secure_url,
              public_id: result.public_id,
            });

            await fs.unlink(file.path);
          } catch (err) {
            console.error(
              `Failed to upload certification file #${i + 1}:`,
              err
            );
            return response(
              res,
              "error",
              err.message,
              500,
              false,
              `Failed to upload certification file #${i + 1}`
            );
          }
        }
      }

      // Create service provider
      const provider = await createServiceProvider({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        gender,
        dateOfBirth,
        experienceYears,
        address,
        specialization,
        professionalTitle,
        bio,
        consultationModes,
        profilePhoto,
        certifications,
      });
      // send service provider to client
      response(
        res,
        "provider",
        provider,
        201,
        true,
        "Service provider registered successfully"
      );
      //SENDING WELCOME EMAIL TO SERVICE PROVIDER
      sendEmail({ fullName, email });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////
};

module.exports = providerAuthController;
