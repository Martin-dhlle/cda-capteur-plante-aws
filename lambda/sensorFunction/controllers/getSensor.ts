import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import fetchSensor from "../../../dynamo-cruds/sensor-crud/fetchSensor";
import Sensor from "../../../utils/interfaces/db/Sensor";

export default async function getSensor(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const serialNumber = event.pathParameters?.serialNumber;

  if (!serialNumber)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const sensor: Sensor | null = await fetchSensor(serialNumber);

  if (!sensor) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({ message: "Ressource non trouvé : sensor" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    body: JSON.stringify({
      message: "données récupérées avec succes",
      data: sensor,
    }),
  };
}
