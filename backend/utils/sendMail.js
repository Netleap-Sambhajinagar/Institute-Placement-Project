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
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      text,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export default sendMail;
