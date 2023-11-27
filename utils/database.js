import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DB_ADDRESS,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
});

export const tableName = "AuthCodes";

const createTableInput = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: "email", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "email", AttributeType: "S" }, // S means string
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

const describeTableInput = {
  TableName: tableName,
};

const checkAndCreateTable = async () => {
  try {
    await client.send(new DescribeTableCommand(describeTableInput));
    console.log("Table already exists, no need to create it.");
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      try {
        await client.send(new CreateTableCommand(createTableInput));
        console.log("Table created successfully.");
      } catch (createError) {
        console.error("Error creating table:", createError);
      }
    } else {
      console.error("Error checking table:", error);
    }
  }
};

checkAndCreateTable();

export const ddbDocClient = DynamoDBDocumentClient.from(client);
