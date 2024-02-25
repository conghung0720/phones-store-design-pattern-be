import { Injectable } from '@nestjs/common';
const { Configuration, OpenAIApi } = require("openai");
 

@Injectable()
export class ChatgptService {
  async getText(textChat: string) {
    const configuration = new Configuration({
        apiKey: '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'
    });
    const openai = await new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${textChat}`,
      temperature: 0,
      max_tokens: 1000,
    });
    return response.data;
  }
}