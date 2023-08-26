import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import {
  App,
  StackProps,
  Stack,
  aws_iam as iam,
  aws_dynamodb as dynamoDb,
} from "aws-cdk-lib";

export class DynamoDBConfigurationStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableData = new dynamoDb.Table(this, `TableData`, {
      tableName: "Data",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    const tableSensor = new dynamoDb.Table(this, `TableSensor`, {
      tableName: "Sensor",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    const tablePlant = new dynamoDb.Table(this, `TablePlant`, {
      tableName: "Plant",
      partitionKey: { name: "_id", type: AttributeType.STRING },
    });

    const dbAccessRole = new iam.Role(this, "DbAccessRole", {
      roleName: "DbAccessRole",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    // Attach the DynamoDB query permission policy to the role
    dbAccessRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:PutItem",
        ],
        resources: [
          tableData.tableArn,
          tableSensor.tableArn,
          tablePlant.tableArn,
        ],
      })
    );
  }
}
