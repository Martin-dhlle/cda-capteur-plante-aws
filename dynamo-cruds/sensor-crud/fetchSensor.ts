import { DynamoDB } from "aws-sdk";
import Sensor from "../../utils/interfaces/db/Sensor";

const dynamo = new DynamoDB.DocumentClient();

export default async function fetchSensor(
  serialNumber: string
): Promise<Sensor | null> {
  try {
    const sensors = await dynamo
      .query({
        TableName: "Sensor",
        KeyConditionExpression: `serialNumber = :serialNumber`,
        ExpressionAttributeValues: {
          ":serialNumber": serialNumber,
        },
      })
      .promise();

    if (sensors.Items && sensors.Items.length > 0) {
      return sensors.Items[0] as Sensor;
    }

    return null;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return null;
  }
}
