import * as cdk from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";

export class LambdaFunctionsConfigurationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Functions
     * */

    const dataFunctionHandler = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "dataHandler",
      {
        entry: "lambda/dataFunction/dataFunction.ts",
        runtime: Runtime.NODEJS_14_X,
        handler: "handler",
        bundling: {
          externalModules: ["aws-sdk"],
          minify: false,
        },
      }
    );

    const dataFunctionHandlerWithParam =
      new cdk.aws_lambda_nodejs.NodejsFunction(this, "dataHandlerWithParam", {
        entry: "lambda/dataFunction/dataFunction.ts",
        runtime: Runtime.NODEJS_14_X,
        handler: "handlerWithParam",
        bundling: {
          externalModules: ["aws-sdk"],
          minify: false,
        },
      });

    /* const sensorFunctionHandler = new cdk.aws_lambda.Function(this, "sensor", {
      code: Code.fromAsset("lambda"),
      runtime: Runtime.NODEJS_14_X,
      handler: "sensorFunction.handler",
    }); */

    /* const plantFunctionHandler = new cdk.aws_lambda.Function(this, "plant", {
      code: Code.fromAsset("lambda"),
      runtime: Runtime.NODEJS_14_X,
      handler: "plantFunction.handler",
    }); */

    /**
     * Api Gateway instanciate and add routing for data, sensor and plant
     */

    const api = new apiGateway.RestApi(this, "ApiGateway").root;

    const dataRoute = api.addResource("data");
    /* const sensorRoute = api.addResource("sensor");
    const plantRoute = api.addResource("plant"); */

    const dataRouteHttpMethodAvailables = ["GET", "POST"];
    const sensorRouteHttpMethodAvailables = ["GET", "PUT"];
    const plantRouteHttpMethodAvailables = ["GET"];

    dataRouteHttpMethodAvailables.forEach((method) =>
      method === "GET" // si la méthode est GET...
        ? // ...ajout d'une child route avec un request param sous la forme /:serialNumber
          dataRoute
            .addResource("{serialNumber}")
            .addMethod(
              method,
              new apiGateway.LambdaIntegration(dataFunctionHandlerWithParam)
            )
        : // ... sinon, intègre seulement la méthode de la valeur de l'itération actuel
          dataRoute.addMethod(
            method,
            new apiGateway.LambdaIntegration(dataFunctionHandler)
          )
    );

    /* sensorRouteHttpMethodAvailables.forEach((method) =>
      sensorRoute.addMethod(
        method,
        new apiGateway.LambdaIntegration(sensorFunctionHandler)
      )
    ); */

    /* plantRouteHttpMethodAvailables.forEach((method) =>
      plantRoute.addMethod(
        method,
        new apiGateway.LambdaIntegration(plantFunctionHandler)
      )
    ); */
  }
}
