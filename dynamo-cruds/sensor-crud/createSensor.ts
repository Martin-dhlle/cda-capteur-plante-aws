import { DynamoDB } from "aws-sdk";
import Sensor from "../../utils/interfaces/db/Sensor";
import { randomUUID } from "crypto";

const dynamo = new DynamoDB.DocumentClient();

export default async function createSensor(
  serialNumber: string
): Promise<Sensor | null> {
  try {
    const newSensor: Sensor = {
      _id: randomUUID(),
      serialNumber: serialNumber,
    };

    await dynamo
      .put({
        TableName: "Sensor",
        Item: newSensor,
      })
      .promise();

    return newSensor;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return null;
  }
}