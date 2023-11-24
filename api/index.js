import express from "express";
export const router = express.Router();
import { transporter } from "../utils/email-agent.js";

router.post("/get-auth-code", (req, res, next) => {
  const email_address = req.body.email;
  let mailOptions = {
    from: '"Antonio Guiotto" <powerhydratoni@gmail.com>', // Sender address
    to: `${email_address}`, // List of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // Plain text body
    html: `
    <div>
    <h3>Hey ${email_address}</h3>
    <p>Here's your authentication code:</p>
    <b>1234</b>
    </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
  try {
    res.send({ email_address });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
