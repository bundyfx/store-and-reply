import { Comprehend } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';
import { Helpers, IAnnotation } from './Helpers';

export class Comprehension {
  client: Comprehend;

  constructor() {
    this.client = AWSXRay.captureAWSClient(new Comprehend());
  }

  public async detectLanguage(message: string): Promise<string> {
    try {
      const language = await this.client.detectDominantLanguage({
        Text: message
    } as AWS.Comprehend.Types.DetectDominantLanguageRequest).promise();
      return await Helpers.asyncSubsegment(
        'determineScore', // The name we want to give our subsegment
        this.determineScore, // The function we want to trace
        language, // Any optional args that the function will use
        { name: 'language', value: language.Languages[0].LanguageCode } as IAnnotation // any optional annotations that will be sent in the subsegment
      );
    } catch (error) {
      throw error;
    }
  }

  private async determineScore(language: AWS.Comprehend.DetectDominantLanguageResponse): Promise<string> {
    return new Promise((resolve) => {
      const languageShortcode = language.Languages.reduce(
        (acc, val) => {
          if (val.Score > acc.Score) { return val; }  return acc;
        }, { Score: 0 }).LanguageCode;
      resolve(languageShortcode);
    });

  }
}
