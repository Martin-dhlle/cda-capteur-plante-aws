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
      name: "DEFAULT",
      timer: 1,
    };

    await dynamo
      .put({
        TableName: "Sensor",
        Item: newSensor,
      })
      .promise();

    return newSensor;
  } catch (error) {
    console.error("Error creation in DynamoDB:", error);
    return null;
  }
}
