import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  const mockChatService = {
    get_responses: jest.fn(),
    get_responses_with_context: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get_responses', () => {
    it('should call ChatService.get_responses and return the result', async () => {
      const body = { prompt: 'Hola chatbot' };
      const expectedResponse = { response: 'Hola, ¿cómo estás?' };
      mockChatService.get_responses.mockResolvedValue(expectedResponse);

      const result = await controller.get_responses(body);

      expect(mockChatService.get_responses).toHaveBeenCalledWith(body.prompt);
      expect(result).toBe(expectedResponse);
    });
  });

  describe('get_responses_with_context', () => {
    it('should call ChatService.get_responses_with_context and return the result', async () => {
      const body = { prompt: '¿Cuál es mi nombre?' };
      const userId = 'user123';
      const expectedResponse = { response: 'Tu nombre es reinaldo.' };
      mockChatService.get_responses_with_context.mockResolvedValue(expectedResponse);

      const result = await controller.get_responses_with_context(body, userId);

      expect(mockChatService.get_responses_with_context).toHaveBeenCalledWith(body.prompt, userId);
      expect(result).toBe(expectedResponse);
    });
  });
});
