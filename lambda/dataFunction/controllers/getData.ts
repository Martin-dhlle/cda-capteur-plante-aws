import { APIGatewayProxyEvent } from "aws-lambda";
import fetchManyData from "../../../dynamo-cruds/data-crud/fetchManyData";
import fetchSensor from "../../../dynamo-cruds/sensor-crud/fetchSensor";
import Sensor from "../../../utils/interfaces/db/Sensor";
import Data from "../../../utils/interfaces/db/Data";

export default async function getData(event: APIGatewayProxyEvent) {
  const serialNumber = event.pathParameters?.serialNumber;

  if (!serialNumber)
    return {
      statusCode: 500,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "requête vide" }),
    };

  const sensor: Sensor | null = await fetchSensor(serialNumber);

  if (!sensor) {
    return {
      statusCode: 404,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "Ressource non trouvé : sensor" }),
    };
  }

  const data: Data[] | null = await fetchManyData(sensor._id);

  if (data === null) {
    return {
      statusCode: 404,
      headers: {
        "x-custom-header": "my custom header value",
      },
      body: JSON.stringify({ message: "Ressource non trouvé : data" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "x-custom-header": "my custom header value",
    },
    body: JSON.stringify({
      message: "données récupérées avec succes",
      data: data,
    }),
  };
}
