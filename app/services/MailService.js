import dotenv from "dotenv";
import nodemailer from "nodemailer";
import getShopConfig from "../config/shop.js";
dotenv.config();

export default class MailService {
  constructor(details) {
    this.details = details;
  }

  async send() {
    var transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || "your-user",
        pass: process.env.SMTP_PASSWORD || "your-password",
      },
    });

    const mailOptions = {
      from: this.details.email,
      to: getShopConfig("admin_email"),
      subject: this.details.subject,
      html: `
              <p><strong>Email:</strong> ${this.details.email}</p>
              <p>${this.details.description}</p>
              <p>Thanks,<br>${this.details.name}</p>
          `,
    };

    try {
      const info = await transport.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
