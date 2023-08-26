import { DynamoDB } from "aws-sdk";
import Sensor from "../../utils/interfaces/db/Sensor";
import Data from "../../utils/interfaces/db/Data";

const dynamo = new DynamoDB.DocumentClient();

export default async function fetchManyData(
  sensorRef: string
): Promise<Data[] | null> {
  try {
    const data = await dynamo
      .scan({
        TableName: "Data",
        FilterExpression: `sensorRef = :sensorRef`,
        ExpressionAttributeValues: {
          ":sensorRef": sensorRef,
        },
      })
      .promise();

    if (data.Items && data.Items.length > 0) {
      return data.Items as Data[];
    }

    return null;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return null;
  }
}
