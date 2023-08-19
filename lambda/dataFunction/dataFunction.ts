import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import createData from "./controllers/uploadData";
import getData from "./controllers/getData";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "POST":
      createData;

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

export const handlerWithParam = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "GET":
      getData;

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
