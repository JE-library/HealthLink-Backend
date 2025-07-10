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
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to HealthLink</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Outfit", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #131220;
      }
a {
        font-style: none;
        color: inherit;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background:rgb(255, 255, 255);
        background: linear-gradient(
          24deg,
          rgb(255, 255, 255) 0%,
          rgba(255, 255, 255, 1) 100%
        );
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.418);
        overflow: hidden;
      }

     .header {
        background: linear-gradient(0deg,rgb(255, 255, 255) 0%, rgb(144, 199, 250) 11%, rgb(72, 151, 253) 100%);
        color:rgb(0, 20, 202);
        padding: 30px 20px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.281);
        overflow: hidden;
      }

      .header h1,
      .header p {
        position: relative;
        z-index: 2; /* above overlay */
      }

      .header h1 {
        color: #000c1a;
        text-shadow: 3px 3px 8px white;
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        font-family: "Playfair Display", serif;
      }

      .header h1 span {
        font-size: 2rem;
      }

      .content {
        padding: 30px 20px;
      }

      .content h2 {
        color:rgb(255, 255, 255);
        margin-top: 0;
        font-family: "Playfair Display", serif;
      }

      .section {
        margin-bottom: 25px;
      }

      .section h3 {
        margin-bottom: 10px;
        color: #333;
        font-family: "Playfair Display", serif;
      }

      .button {
        display: inline-block;
        background-color:rgb(72, 151, 253);
        color:rgb(255, 255, 255);
        text-decoration: none;
        padding: 12px 25px;
        border-radius: 6px;
        font-weight: bold;
        margin-top: 20px;
      }

      .footer {
        font-size: 12px;
        text-align: center;
        color:rgb(255, 255, 255);
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to <br /><span>HealthLink</span></h1>
        <p>Your gateway to all your Healthcare needs from the safety of your home.</p>
      </div>

      <div class="content">
        <h2>Hello ${user.username},</h2>
        <p>
          Thanks for joining HealthLink! Here's what you can expect with us:
        </p>

        <div class="section">
          <h3>For our Service Providers:</h3>
          <ul>
            <li>
              Get all your appointments, whether it be appointment details, cancellations, conducting consultations, getting available slots and updating available slots.
            </li>
            <li>
              Create Wellness or nutrition posts, as well as update and delete your posts.
            </li>
            <li>
              Schedule Livechat sessions with clients who have selected appointments.
            </li>
            <li>
              Use your dashboard to
              <strong>view, edit, and delete</strong> your posts and appointments easily.
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>For our Users:</h3>
          <ul>
            <li>Book consultations with service providers </li>
            <li>
              Get all user notifications like booked appointments with details or cancelled appointments.
            </li>
            <li>
              View all wellness and nutrition posts as well as availability of ambulance services
            </li>
            <li>
              Request ambulance service.
            </li>
            <li>
            Schedule home lab tests.
            </li>
          </ul>
        </div>

        <p>Start exploring or managing your pages below:</p>
        <a href="........https://NOTDEPLOYED YET............" target="_blank" class="button" 
          >Go to Your Dashboard</a
        >
      </div>

      <div class="footer">
        &copy; 2025 HealthLink. All rights reserved.<br />
        You received this email because you signed up on our platform.
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