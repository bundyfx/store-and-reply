import { APIGatewayProxyResult } from 'aws-lambda';
import { Agent } from 'https';
import AWSXRay from 'aws-xray-sdk-core';

interface IResponseBody {
  message: string;
}

export interface IAnnotation {
  name: string;
  value: string;
}

export interface IReplyIncoming {
  statusCode: number;
  body: string;
  name?: string;
}

export class Helpers {
  constructor(config: any) {
    this.setup(config);
  }

  private async setup(config: any) {
    await this.initialize(config);
  }

  public async buildResponse(reply: IReplyIncoming): Promise < APIGatewayProxyResult > {
    const responseBody = {
      message: reply.name || reply.body
    } as IResponseBody;

    const response = {
      statusCode: reply.statusCode,
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(responseBody)
    } as APIGatewayProxyResult;

    return response;
  }

  public static isListOfAnnotations(thing: any): thing is IAnnotation[] {
    return this.isSingleAnnotation(thing) ? false : true;
  }

  public static isSingleAnnotation(thing: any): thing is IAnnotation {
    return thing.name ? true : false;
  }

  public static async asyncSubsegment(name: string,
                                      fn: Function, args?: any | undefined,
                                      annotations?: IAnnotation | IAnnotation[] | undefined): Promise < any > {
    const subsegment = AWSXRay.getSegment().addNewSubsegment(name);
    try {
      const output = await fn(args);
      if (Helpers.isSingleAnnotation(annotations)) {
        subsegment.addAnnotation(annotations.name, annotations.value);
      }
      if (Helpers.isListOfAnnotations(annotations)) {
        annotations.map((annotation) => {
          subsegment.addAnnotation(annotation.name, annotation.value);
        });
      }
      return output;
    } catch (error) {
      subsegment.addError(error);
      throw error;
    } finally {
      subsegment.close();
    }
  }

  private async initialize(config: any) : Promise < void > {
    try {
      const sslAgent:Agent = new Agent({
        keepAlive: true,
        maxSockets: 64,
        rejectUnauthorized: true
      });

      config.update({
        httpOptions: {
          agent: sslAgent
        }
      });
    } catch (error) {
    }
  }
}
