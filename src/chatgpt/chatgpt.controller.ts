import { Controller } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { Body, Post } from '@nestjs/common';

@Controller('chatgpt')
export class ChatGptController {
  constructor(private chatGpt: ChatgptService) {}
  @Post()
  async displayTextChat(@Body() chat: Record<string, any>) {
    const textChat = await chat.textChat;
    if (textChat) {
      const getAnswer = await this.chatGpt.getText(chat.textChat);
      return await getAnswer.choices.at(0);
    }
    return {
      text: 'Trying again',
    };
  }
}