import * as cdk from "aws-cdk-lib";
import { AwsAppConfigurationStack } from "../lib/aws-app-configuration-stack";
import { DynamoDBConfigurationStack } from "../lib/dynamo-db-configuration-stack";
import { LambdaFunctionsConfigurationStack } from "../lib/lambda-functions-configuration-stack";

const app = new cdk.App();

const dynamoDBStack = new DynamoDBConfigurationStack(
  app,
  "DynamoDBConfigurationStack"
);
const lambdaStack = new LambdaFunctionsConfigurationStack(
  app,
  "LambdaFunctionsConfigurationStack"
);

const awsAppConfigStack = new AwsAppConfigurationStack(
  app,
  "AwsAppConfigurationStack"
);

// Add dependencies to the AwsAppConfigurationStack
awsAppConfigStack.addDependency(dynamoDBStack);
awsAppConfigStack.addDependency(lambdaStack);
