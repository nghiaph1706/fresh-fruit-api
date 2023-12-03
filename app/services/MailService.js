import dotenv from "dotenv";
import nodemailer from "nodemailer";
import getShopConfig from "../config/shop.js";
import fs from "fs";
import ejs from "ejs";
import juice from "juice";

dotenv.config();

export default class MailService {
  constructor() {
    this.transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || "your-user",
        pass: process.env.SMTP_PASSWORD || "your-password",
      },
    });
  }

  async sendContactAdmin(details) {
    const mailOptions = {
      from: details.email,
      to: getShopConfig("admin_email"),
      subject: details.subject,
      html: `
        <p><strong>Email:</strong> ${details.email}</p>
        <p>${details.description}</p>
        <p>Thanks,<br>${details.name}</p>
      `,
    };

    try {
      const info = await this.transport.sendMail(mailOptions);
      console.log("Contact Us Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending Contact Us email:", error);
    }
  }

  async sendResetPassword(details) {
    const templatePath = `templates/resetPassword.html`;
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, "utf-8");
      const html = ejs.render(template, { token: details.token });
      const htmlWithStylesInlined = juice(html);
      const mailOptions = {
        from: getShopConfig("admin_email"),
        to: details.email,
        subject: "Reset Your Password",
        html: htmlWithStylesInlined,
      };

      try {
        const info = await this.transport.sendMail(mailOptions);
        return true;
      } catch (error) {
        console.error("Error sending Reset Password email:", error);
        return false;
      }
    }
  }

  async sendWelcome(details) {
    const mailOptions = {
      from: getShopConfig("admin_email"),
      to: details.email,
      subject: `Welcome to ${process.env.APP_NAME || "APP_NAME"}`,
      html: `
        <p>Hello,</p>
        <p>Welcome ${process.env.APP_NAME || "APP_NAME"}.</p>
        <p>Thank you,<br>${process.env.APP_NAME || "APP_NAME"}</p>
      `,
    };

    try {
      const info = await this.transport.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendSubscribeToNewsletter(details) {
    const mailOptions = {
      from: getShopConfig("admin_email"),
      to: details.email,
      subject: `Welcome to ${process.env.APP_NAME || "APP_NAME"}`,
      html: `
        <p>Hello,</p>
        <p>Welcome ${process.env.APP_NAME || "APP_NAME"}.</p>
        <p>Thank you,<br>${process.env.APP_NAME || "APP_NAME"}</p>
      `,
    };

    try {
      const info = await this.transport.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}
