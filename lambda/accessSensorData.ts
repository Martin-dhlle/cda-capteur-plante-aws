import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "GET":
      return { statusCode: 404, body: "" };
    case "POST":
      if (!event.body)
        return {
          statusCode: 500,
          headers: {
            "x-custom-header": "my custom header value",
          },
          body: JSON.stringify({ message: "requête vide" }),
        };
      const { serialNumber, humidity } = JSON.parse(event.body);

      const sensor: any = dynamo.get(
        {
          TableName: "Sensor",
          Key: {
            serialNumber: serialNumber,
          },
        },
        (err, data) => data
      ); // search for a existant serialNumber

      if (!sensor) {
        dynamo.put({
          TableName: "Sensor",
          Item: { serialNumber: serialNumber },
        });
      }

      dynamo.put({
        TableName: "Data",
        Item: { serialNumber: serialNumber, humidity: humidity },
      });

      return {
        statusCode: 500,
        headers: {
          "x-custom-header": "my custom header value",
        },
        body: JSON.stringify({ message: "Ressource créée" }),
      };

    default:
      return {
        statusCode: 500,
        headers: {
          "x-custom-header": "my custom header value",
        },
        body: JSON.stringify({
          message: `méthode de requête non existante : ${event.httpMethod}`,
        }),
      };
  }
};
