import nodemailer from "nodemailer";
import constants from "../constants.js";

const transporter = nodemailer.createTransport({
  // Thông tin cấu hình gửi email (cấu hình SMTP hoặc một dịch vụ gửi email khác)
  // Ví dụ sử dụng Gmail:
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

export const sendMail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
