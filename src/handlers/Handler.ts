import { config } from 'aws-sdk';
import { Metrics } from 'src/services/CloudWatch';
import { Dynamo } from 'src/services/DynamoDB';
import { Translation } from 'src/services/Translate';
import { Comprehension } from 'src/services/Comprehension';
import { TaskHandler } from 'src/types/TaskHandler';
import { APIGatewayEvent } from 'aws-lambda';
import { Helpers, IReplyIncoming } from 'src/services/Helpers';
import { Validator } from 'src/services/Validator';

const helpers = new Helpers(config);
const validate = new Validator();
const translate = new Translation();
const comprehend = new Comprehension();
const dynamoDB = new Dynamo();
const cloudWatch = new Metrics();

const handler: TaskHandler = async (event: APIGatewayEvent): Promise<any> => {
  try {
    const validatedInput = await validate.validateQueryStringParameters(event);
    const text = await translate.text(
      await comprehend.detectLanguage(validatedInput.message)
    );
    await dynamoDB.storeItem(validatedInput, text);
    await cloudWatch.put(validatedInput.message.length);
    return await helpers.buildResponse({ body: text, statusCode: 200 } as IReplyIncoming);
  } catch (error) {
    return await helpers.buildResponse({ body: error.message, statusCode: 500 } as IReplyIncoming);
  }
};

export { handler };
