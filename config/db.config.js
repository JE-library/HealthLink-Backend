const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB connected Successfully!");
};

module.exports = connectDB;
