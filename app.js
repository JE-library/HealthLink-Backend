const express = require("express");
const connectDB = require("./config/db.config.js");
const cors = require("cors");
const dotenv = require("dotenv");

const errorHandler = require("./middlewares/errorHandler.middleware.js");
const userRoutes = require("./routes/user.routes.js");
const serviceProviderRoutes = require("./routes/serviceProvider.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const publicRoutes = require("./routes/public.routes.js");
const sendEmail = require("./utils/sendMail.utils.js");
const upload = require("./middlewares/upload.middleware.js");
const cloudinary = require("./config/cloudinary.config.js");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

//TESTING IF UPLOAD WORKS
// app.post("/api/testinguploads", upload.single("avatar"), (req, res) =>{
//   cloudinary.uploader.upload('avatar'), //NEED TO WORK ON CLOUDINARY POSTING
//   res.send("Uploaded")
// })

// // TESTING IF EMAIL WORKS
app.get("/api/testemail", async (req, res)=> {
  const user = {email:'jackie.creative233@gmail.com'}
  await sendEmail(user)
  res.send("Email Sent")
});

// app.use("/api/providers", serviceProviderRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api", publicRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    process.exit(1);
  }
};

startServer();
