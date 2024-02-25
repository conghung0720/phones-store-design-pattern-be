import { Module } from '@nestjs/common';
import { ChatGptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';

@Module({
  controllers: [ChatGptController],
  providers: [ChatgptService]
})
export class ChatgptModule {}
