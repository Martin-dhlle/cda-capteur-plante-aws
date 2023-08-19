import * as cdk from "aws-cdk-lib";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

export class DynamoDBConfigurationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_dynamodb.Table(this, `TableData`, {
      tableName: "Data",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    new cdk.aws_dynamodb.Table(this, `TableSensor`, {
      tableName: "Sensor",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    // new cdk.aws_dynamodb.Table(this, `TablePlant`, {
    //   tableName: "Plant",
    //   partitionKey: { name: "_id", type: AttributeType.STRING },
    // });
  }
}
