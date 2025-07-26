const express = require("express");
const connectDB = require("./config/db.config.js");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./documentation/swagger-output.json");
const dotenv = require("dotenv");

const errorHandler = require("./middlewares/errorHandler.middleware.js");
const userRoutes = require("./routes/user.routes.js");
const serviceProviderRoutes = require("./routes/serviceProvider.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const generalRoutes = require("./routes/general.routes.js");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/providers", serviceProviderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", generalRoutes);

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

/////////////////////////////////////////////////////////////
// const Posts = require("./models/Post.js")
const ServiceProvider = require("./models/ServiceProvider.js");

const provider = {}
;

async function inserter(data) {
  try {
    // await Posts.insertMany(data);
    await ServiceProvider.insertOne(data);
    console.log("✅ Data inserted successfully.");
  } catch (err) {
    console.error("❌ Error inserting Data:", err);
  }
}

// inserter(provider);
