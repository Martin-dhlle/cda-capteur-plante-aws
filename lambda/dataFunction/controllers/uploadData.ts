import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Sensor from "../../../utils/interfaces/db/Sensor";
import fetchSensor from "../../../dynamo-cruds/sensor-crud/fetchSensor";
import createSensor from "../../../dynamo-cruds/sensor-crud/createSensor";
import createData from "../../../dynamo-cruds/data-crud/createData";

export default async function uploadData(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event.body)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const { serialNumber, humidityRate } = JSON.parse(event.body);

  if (!serialNumber || !humidityRate)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const sensor: Sensor | null =
    (await fetchSensor(serialNumber)) ?? (await createSensor(serialNumber));

  if (!sensor) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify({ message: "Problème de requête" }),
    };
  }

  await createData(sensor._id, humidityRate);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    body: JSON.stringify({ message: "Ressource créée" }),
  };
}
