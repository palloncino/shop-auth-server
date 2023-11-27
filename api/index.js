import express from "express";
export const router = express.Router();
import { transporter } from "../utils/email-agent.js";
import { generateCode } from "../utils/generate-auth-code.js";
import { ddbDocClient, tableName } from "../utils/database.js";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

router.post("/get-auth-code", async (req, res, next) => {
  const email_address = req.body.email;
  const auth_code = generateCode();

  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      email: "example@email.com",
      code: auth_code,
    },
  });

  try {
    await ddbDocClient.send(putCommand);
    console.log("Item inserted successfully.");
  } catch (error) {
    console.error("Error Inserting Item:", error);
  }

  let mailOptions = {
    from: '"Antonio Guiotto" <powerhydratoni@gmail.com>',
    to: `${email_address}`,
    subject: "Your authentication code",
    html: `
    <div>
      <h3>Hey ${email_address}</h3>
      <p>
      Here's your authentication code to login, remember that once you access with this code, your authentication session will last for 15 minutes, after that you will need to repeat the process.
      </p>
      <div>
        <span>Code:</span><b> ${auth_code}</b>
      </div>
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

router.post("/post-auth-code", async (req, res, next) => {
  // const email_address = req.body.email;
  // const auth_code = req.body.authCode;
  const scanInput = {
    TableName: tableName,
  };

  const scanCommand = new ScanCommand(scanInput);

  try {
    const data = await ddbDocClient.send(scanCommand);
    console.log("Scan Completed:", data.Items);
    // You can process and send back the data here if needed
    res.send({ data: data.Items });
  } catch (error) {
    console.error("Error in Scan Operation:", error);
    res.status(500).send({ error: "Error in Scan Operation" });
  }
});
