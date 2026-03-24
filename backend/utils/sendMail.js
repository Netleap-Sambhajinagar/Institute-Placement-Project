import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (email, subject, text) => {
  try {
    if (!process.env.EMAIL || !process.env.PASSWORD) {
      throw new Error(
        "Email credentials not configured in environment variables",
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Test connection before sending
    await transporter.verify();

    const result = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      text,
    });

    console.log("✅ Email sent successfully to:", email);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

export default sendMail;
