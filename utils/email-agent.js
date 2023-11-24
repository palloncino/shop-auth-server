import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "localhost", // Host name of your MTA
  port: 25, // Standard SMTP port
  secure: false, // True for 465, false for other ports
  tls: {
    // Do not fail on invalid certs (if using self-signed certificates)
    rejectUnauthorized: false,
  },
});
