import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: `${process.env.ACCOUNT1_GMAIL_EMAIL}`,
    pass: `${process.env.ACCOUNT1_GMAIL_PASSWORD}`,
  },
});
