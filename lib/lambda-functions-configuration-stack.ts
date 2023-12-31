import { App, StackProps, Stack, aws_iam as iam } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";

export class LambdaFunctionsConfigurationStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Roles IAM
     */

    const dbAccessRole = iam.Role.fromRoleName(
      this,
      "DbAccessRoleImport",
      "DbAccessRole"
    );

    /**
     * Functions
     * */

    const dataFunctionHandler = new NodejsFunction(this, "dataHandler", {
      entry: "lambda/dataFunction/dataFunction.ts",
      runtime: Runtime.NODEJS_14_X,
      handler: "handler",
      role: dbAccessRole,
      bundling: {
        externalModules: ["aws-sdk"],
        minify: false,
      },
    });

    const dataFunctionHandlerWithParam = new NodejsFunction(
      this,
      "dataHandlerWithParam",
      {
        entry: "lambda/dataFunction/dataFunction.ts",
        runtime: Runtime.NODEJS_14_X,
        handler: "handlerWithParam",
        role: dbAccessRole,
        bundling: {
          externalModules: ["aws-sdk"],
          minify: false,
        },
      }
    );

    const sensorFunctionHandlerWithParam = new NodejsFunction(
      this,
      "sensorHandlerWithParam",
      {
        entry: "lambda/sensorFunction/sensorFunction.ts",
        runtime: Runtime.NODEJS_14_X,
        handler: "handlerWithParam",
        role: dbAccessRole,
        bundling: {
          externalModules: ["aws-sdk"],
          minify: false,
        },
      }
    );

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
     * Api Gateway instanciate and add routing for data, sensor and plant + ApiKey
     */

    const api = new apiGateway.RestApi(this, "ApiGateway", {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        allowCredentials: true,
      },
    });
    api.addApiKey("ApiKeyCDA");

    const dataRoute = api.root.addResource("data");
    const sensorRoute = api.root.addResource("sensor");
    // const plantRoute = api.addResource("plant");

    const dataRouteHttpMethodAvailables = ["GET", "POST"];
    const sensorRouteHttpMethodAvailables = ["GET"];
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

    sensorRouteHttpMethodAvailables.forEach((method) =>
      method === "GET" // si la méthode est GET...
        ? // ...ajout d'une child route avec un request param sous la forme /:serialNumber
          sensorRoute
            .addResource("{serialNumber}")
            .addMethod(
              method,
              new apiGateway.LambdaIntegration(sensorFunctionHandlerWithParam)
            )
        : // ... sinon, intègre seulement la méthode de la valeur de l'itération actuel
          sensorRoute.addMethod(
            method,
            new apiGateway.LambdaIntegration(sensorFunctionHandlerWithParam)
          )
    );

    /* plantRouteHttpMethodAvailables.forEach((method) =>
      plantRoute.addMethod(
        method,
        new apiGateway.LambdaIntegration(plantFunctionHandler)
      )
    ); */
  }
}
