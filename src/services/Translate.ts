import { Translate } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

const {
  REPLY_MESSAGE,
  REPLY_LANGUAGE
} = process.env;

export class Translation {
  client: Translate;

  constructor() {
    this.client = AWSXRay.captureAWSClient(new Translate());
  }

  public async text(language: string): Promise<string> {
    if (language !== REPLY_LANGUAGE) {
      const translateData = await this.client.translateText({
                  SourceLanguageCode: REPLY_LANGUAGE,
                  TargetLanguageCode: language,
                  Text: REPLY_MESSAGE
              }).promise();
      return translateData.TranslatedText;
    }
    return REPLY_MESSAGE;
  }
}
