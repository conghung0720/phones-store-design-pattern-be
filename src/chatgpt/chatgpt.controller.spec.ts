import { Test, TestingModule } from '@nestjs/testing';
import { ChatGptController } from './chatgpt.controller';

describe('ChatgptController', () => {
  let controller: ChatGptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatGptController],
    }).compile();

    controller = module.get<ChatGptController>(ChatGptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
