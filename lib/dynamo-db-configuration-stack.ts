import * as cdk from "aws-cdk-lib";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

export class DynamoDBConfigurationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_dynamodb.Table(scope, `${id} 1`, {
      tableName: "data",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    new cdk.aws_dynamodb.Table(scope, `${id} 2`, {
      tableName: "sensor",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });
  }
}
