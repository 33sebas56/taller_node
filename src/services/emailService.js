import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const enviarCodigo2FA = async (destinatario, codigo) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: destinatario,
    subject: "Codigo de verificacion - Biblioteca Segura",
    text: `Tu codigo de verificacion es: ${codigo}`
  };

  return await transporter.sendMail(mailOptions);
};