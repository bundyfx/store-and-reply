import { APIGatewayProxyEvent } from 'aws-lambda';
import { InvalidMessageError, InvalidUserError, InvalidRequestError  } from './Errors';

export interface IValidInput {
  user: string;
  message: string;
}

export class Validator {
  constructor() {}

  public async validateQueryStringParameters(event: APIGatewayProxyEvent): Promise<IValidInput> {
    if (!event.queryStringParameters) {
      throw new InvalidRequestError('No Query String Parameters given', 400);
    }
    if ((event.queryStringParameters.user == null) || (event.queryStringParameters.user === '')) {
      throw new InvalidUserError('User is invalid', 400);
    }
    if ((event.queryStringParameters.message == null) || (event.queryStringParameters.message === '')) {
      throw new InvalidMessageError('Message is invalid', 400);
    }
    return {
      user: event.queryStringParameters.user,
      message: event.queryStringParameters.message
    } as IValidInput;
  }
}
