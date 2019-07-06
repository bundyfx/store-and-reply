import { CloudWatch } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

const {
  METRIC_NAMESPACE,
  METRIC_DIMENSION_NAME,
  METRIC_DIMENSION_VALUE,
  METRIC_NAME
} = process.env;

export class Metrics {
  client: CloudWatch;

  constructor() {
    this.client = AWSXRay.captureAWSClient(new CloudWatch());
  }
  public async put(value: number): Promise<void> {
    const metricData = await this.client.putMetricData({
        MetricData: [
            {
                MetricName: METRIC_NAME,
                Dimensions: [
                    {
                        Name: METRIC_DIMENSION_NAME,
                        Value: METRIC_DIMENSION_VALUE
                    }
                ],
                Timestamp: new Date,
                Value: value
            }
        ],
        Namespace: METRIC_NAMESPACE
    } as AWS.CloudWatch.PutMetricDataInput).promise();
  }
}
