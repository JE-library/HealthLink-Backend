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
    <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap" rel="stylesheet"
    />
    <style>
      body {
        font-family: "TikTok Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        background-color:rgb(144, 199, 250);
        margin: 0;
        padding: 0;
        color: #131220;
      }
a {
        font-style: normal;
        color: inherit;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: linear-gradient(
          24deg,
          rgb(170, 203, 247) 10%,
          rgb(255, 255, 255) 70%
        );
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.73);
        overflow: hidden;
      }

     .header {
        background: rgb(144, 199, 250)50%;
        color:rgb(255, 255, 255);
        padding: 30px 20px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.281);
        overflow: hidden;
      }

      .header h1,
      .header p {
        position: relative;
        z-index: 2; /* above overlay */
      }

      .header h1 {
        color:rgb(255, 255, 255);
        text-shadow: 3px 3px 8px rgb(0, 0, 0) ;
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        font-family:"TikTok Sans", sans-serif;
      }

      .content h2 span {
        font-size: 3rem;
        color:rgb(72, 151, 253);
      }

      .content {
        padding: 30px 20px;
      }

      .content h2 {
        color:rgb(144, 199, 250);
        margin-top: 0;
        font-family:"TikTok Sans", sans-serif;
      }
      .content p {
      font-size: 1rem;
      }

      .section {
        margin-bottom: 25px;
        font-family: "TikTok Sans", sans-serif;
      }

      .section h3 {
        margin-bottom: 10px;
        font-size: 1rem;
        color: rgb(0, 20, 202);
        font-family: "TikTok Sans", sans-serif;
      }

      .button {
        display: inline-block;
        background-color:rgb(72, 151, 253);
        color:rgb(255, 255, 255);
        text-decoration: none;
        padding: 12px 25px;
        border-radius: 15px;
        font-weight: bold;
        margin-top: 20px;
      }
      
      .container span {
      font-size: 2rem;
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
        <h4> <span> HealthLink </span> <br /> The gateway to all your Healthcare needs from the safety of your home. </h4>
      </div>

      <div class="content">
         <h2> Welcome ${user.fullName}, you've just signed up with <br /> <span> HealthLink. </span> </h2>
        <p>
          Thanks for joining our community! Here's what you can expect with us:
        </p>

        <div class="section">
          <h3>For our Service Providers:</h3>
          <ul>
            <li>
              You can get all your appointments, whether it be appointment details, cancellations, conducting consultations, getting available slots and updating available slots. 
            </li>
            <li>
              Schedule Livechat sessions with clients who have selected appointments and Use your dashboard to
              <strong>view, edit, and delete</strong> your posts and appointments easily as well as Create Wellness or nutritional posts.
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>For our Users:</h3>
          <ul>
            <li>Book consultations with service providers and <strong> Schedule home lab tests. </strong> Your notifications like booked appointments with details or cancelled appointments can all be accessed while Viewing wellness and nutritional posts as well as <strong> requesting availability of ambulance services. </strong>
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
