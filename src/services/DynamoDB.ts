import { DynamoDB } from 'aws-sdk';
import { IValidInput } from './Validator';
import AWSXRay from 'aws-xray-sdk-core';

export class Dynamo {
  client: DynamoDB.DocumentClient;

  constructor () {
    this.client = new DynamoDB.DocumentClient({
      service: new DynamoDB()
    });
    AWSXRay.captureAWSClient((this.client as any).service);
  }

  public async storeItem(input: IValidInput, text: string) {
    return this.client.put({
      TableName: process.env.MESSAGES_TABLE,
      Item: {
        ...input,
        timestamp: Date.now(),
        message: text
      }
    }).promise();
  }

}
