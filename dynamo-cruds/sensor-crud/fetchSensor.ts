import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Sensor from "../../utils/interfaces/db/Sensor";

const dynamo = new DocumentClient();

export default async function fetchSensor(
  serialNumber: string
): Promise<Sensor | null> {
  try {
    const sensors = await dynamo
      .scan({
        TableName: "Sensor",
        FilterExpression: `serialNumber = :serialNumber`,
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
