import { Injectable } from '@nestjs/common';
const { Configuration, OpenAIApi } = require("openai");
 

@Injectable()
export class ChatgptService {
  async getText(textChat: string) {
    const MODEL_AI = 'text-davinci-003'

    const configuration = new Configuration({
        apiKey: process.env.KEY_CHATGPT
    });
    const openai = await new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: MODEL_AI,
      prompt: `${textChat}`,
      temperature: 0,
      max_tokens: 1000,
    });
    return response.data;
  }
}