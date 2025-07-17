const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (user) => {
  try {
    // 1. Setup transporter with email server info and login
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // implicit SSL/TLS
      auth: {
        user: "jackie.creative233@gmail.com",
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. Define email details
    const mailOptions = {
      from: `"HealthLink" <HealthLink@example.email>`,
      to: user.email,
      subject: "Welcome to HealthLink",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to HealthLink</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background-color: #f0f8ff;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #d0eaff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #007acc;
    }
    .content {
      padding: 20px;
      color: #333;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .section-title {
      margin-top: 20px;
      font-size: 18px;
      font-weight: 600;
      color: #007acc;
    }
    ul {
      padding-left: 20px;
    }
    .button {
      display: inline-block;
      margin-top: 25px;
      padding: 12px 20px;
      background-color: #007acc;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
    }
    .button a {
      color: #d0eaff;
    }

    .button:hover {
    color: #d0eaff;
    background-color: #015288ff;
    }

    .footer {
      font-size: 12px;
      text-align: center;
      color: #888;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to HealthLink</h1>
    </div>
    <div class="content">
      <p>Welcome <strong>[User's Name]</strong>, you've just signed up with <strong>HealthLink</strong>.</p>
      <p>Thanks for joining our community! Here's what you can expect with us:</p>

      <div class="section-title">For our Service Providers:</div>
      <ul>
        <li>Manage all your appointments — including details, cancellations, and consultations.</li>
        <li>Access and update your available time slots easily.</li>
        <li>Schedule LiveChat sessions with clients who booked appointments.</li>
        <li>Use your dashboard to view, edit, and delete posts and appointments.</li>
        <li>Create wellness or nutritional posts to share with the community.</li>
      </ul>

      <div class="section-title">For our Users:</div>
      <ul>
        <li>Book consultations with service providers.</li>
        <li>Schedule home lab tests with just a few clicks.</li>
        <li>Receive notifications about appointment bookings or cancellations.</li>
        <li>View wellness and nutritional posts shared by professionals.</li>
        <li>Request ambulance service availability anytime.</li>
      </ul>

      <p>Start exploring or managing your pages below:</p>
      <a href="https://PUTLINKHERE WHEN DONE " class="button"> Go to Dashboard </a>

      <p>If you need assistance, our support team is here to help.</p>
      <p>Wishing you great health,<br/>The HealthLink Team</p>
    </div>
    <div class="footer">
      &copy; 2025 HealthLink. All rights reserved.
    </div>
  </div>
</body>
</html>

`,
    };
    // 3. Send email and get info about it (Like a Reciept)
    const info = await transporter.sendMail(mailOptions);
    // 4. Log the email ID and get preview link (for Ethereal)
    console.log("Email Sent With Gmail", info);
    return {
      success: true,
    };
  } catch (error) {
    console.log("Email Error", error);
    return {
      success: false,
      error,
    };
  }
};

module.exports = sendEmail;
