import express from "express";
export const router = express.Router();
import { transporter } from "../utils/email-agent.js";
import { generateCode } from "../utils/generate-auth-code.js";
import { ddbDocClient, tableName } from "../utils/database.js";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

router.post("/get-auth-code", async (req, res, next) => {
  const email_address = req.body.email;
  const auth_code = generateCode();

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + 10 * 60; // expires after 10 minutes.

  const putCommand = new PutCommand({
    TableName: tableName,
    Item: {
      email: email_address,
      code: auth_code,
      expiresAt: expirationTime,
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
  const email_address = req.body.email;
  const auth_code = req.body.code;

  const queryInput = {
    TableName: tableName,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email_address,
    },
  };

  const queryCommand = new QueryCommand(queryInput);

  try {
    const data = await ddbDocClient.send(queryCommand);
    const item = data.Items.find(
      ({ email, code }) =>
        `${email}` === `${email_address}` && `${code}` === `${auth_code}`
    );
    const currentTime = Math.floor(Date.now() / 1000);

    if (!item) {
      res.send({ message: "user or code not found, please try again." });
    } else if (currentTime > item.expiresAt) {
      res.send({ message: "Code expired, please request a new code." });
    } else {
      const duration = "5m";
      const token = jwt.sign({ email: email_address }, process.env.JWT_SECRET, {
        expiresIn: duration,
      });
      res.send({ token, duration });
    }
  } catch (error) {
    console.error("Error in Query Operation:", error);
    res.status(500).send({ error: "Error in Query Operation" });
  }
});

router.get("/scan-auth-codes", async (req, res, next) => {
  const scanInput = {
    TableName: tableName,
  };

  const scanCommand = new ScanCommand(scanInput);

  try {
    const data = await ddbDocClient.send(scanCommand);
    console.log("Scan Completed:", data.Items);
    res.send({ data: data.Items });
  } catch (error) {
    console.error("Error in Scan Operation:", error);
    res.status(500).send({ error: "Error in Scan Operation" });
  }
});

router.post("/secret", (req, res, next) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.send({ message: "Access granted", decoded });
  } catch (error) {
    res.status(401).send({ message: "Access denied", error: error.message });
  }
});
