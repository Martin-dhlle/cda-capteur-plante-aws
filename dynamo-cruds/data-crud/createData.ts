import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import Data from "../../utils/interfaces/db/Data";

const dynamo = new DynamoDB.DocumentClient();

export default async function createData(
  sensorRef: string,
  humidityRate: number
): Promise<Data | null> {
  try {
    const newData: Data = {
      _id: randomUUID(),
      generatedAt: new Date().toLocaleString(),
      humidityRate: humidityRate,
      sensorRef: sensorRef,
    };

    await dynamo
      .put({
        TableName: "Data",
        Item: newData,
      })
      .promise();

    return newData;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return null;
  }
}
