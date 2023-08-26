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
