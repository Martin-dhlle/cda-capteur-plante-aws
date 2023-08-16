import * as cdk from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";

const currentHttpMethodsAvalaible = ["GET", "POST", "PUT"];

export class LambdaConfigurationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const functionHandler = new cdk.aws_lambda.Function(scope, id, {
      code: Code.fromAsset("../lambda/accessSensorData.ts"),
      runtime: Runtime.NODEJS_14_X,
      handler: "handler",
    });

    const apiGateway = cdk.aws_apigateway;
    const api = new apiGateway.RestApi(scope, id);
    const integration = new apiGateway.LambdaIntegration(functionHandler);

    currentHttpMethodsAvalaible.forEach((method) =>
      api.root.addMethod(method, integration)
    );
  }
}
