import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import uploadData from "./controllers/uploadData";
import getData from "./controllers/getData";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "POST":
      return await uploadData(event);

    default:
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
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
      return await getData(event);

    default:
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        body: JSON.stringify({
          message: `méthode de requête non existante : ${event.httpMethod}`,
        }),
      };
  }
};
