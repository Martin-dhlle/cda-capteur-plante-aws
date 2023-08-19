import { APIGatewayProxyEvent } from "aws-lambda";
import Sensor from "../../../utils/interfaces/db/Sensor";
import fetchSensor from "../../../dynamo-cruds/sensor-crud/fetchSensor";
import createSensor from "../../../dynamo-cruds/sensor-crud/createSensor";
import createData from "../../../dynamo-cruds/data-crud/createData";

export default async function uploadData(event: APIGatewayProxyEvent) {
  if (!event.body)
    return {
      statusCode: 500,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const { serialNumber, humidityRate } = JSON.parse(event.body);

  if (!serialNumber || !humidityRate)
    return {
      statusCode: 500,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const sensor: Sensor | null =
    (await fetchSensor(serialNumber)) ?? (await createSensor(serialNumber));

  if (!sensor) {
    return {
      statusCode: 404,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "Ressource non trouvé" }),
    };
  }

  await createData(sensor._id, humidityRate);

  return {
    statusCode: 201,
    headers: {
      "x-custom-header": "my custom header value",
    },
    body: JSON.stringify({ message: "Ressource créée" }),
  };
}
