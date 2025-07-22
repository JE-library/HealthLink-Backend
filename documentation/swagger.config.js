const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const doc = {
  info: {
    title: "HealthLink",
    description: `
HealthLink is a RESTful API that powers a healthcare platform connecting users with licensed health professionals. It supports core functionalities such as user registration, appointment booking, lab service scheduling, provider management, and system administration.

## Key Features

### Users
- Register and manage personal profiles
- Book and cancel health appointments
- Schedule home lab services
- Chat with health providers
- View wellness and nutrition posts
- Access personal dashboard with stats

### Service Providers
- Register and manage professional profiles
- Set availability and manage appointments
- Confirm or cancel bookings
- Chat with users
- Post and manage wellness content
- View lab requests and submit results

### Admin
- Manage all users and providers
- Moderate appointments and lab requests
- Control provider application status
- Access platform-wide analytics and stats

Use the categorized endpoints below to interact with the platform.`,
  },
    host: "healthlink-backend01.onrender.com",
  // host: `localhost:${process.env.PORT}`,
  schemes: ["https"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const routes = ["../app.js"];

swaggerAutogen(outputFile, routes, doc);
