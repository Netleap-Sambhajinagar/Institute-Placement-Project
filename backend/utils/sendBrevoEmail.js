// Brevo (Sendinblue) API-based email sender
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const sendBrevoEmail = async (to, subject, htmlContent) => {
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
    process.env.BREVO_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: to }],
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "your_verified_sender@email.com",
      name: process.env.BREVO_SENDER_NAME || "NITS Dashboard",
    },
    subject,
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("❌ Brevo email sending failed:", error.message);
    throw error;
  }
};

export default sendBrevoEmail;
