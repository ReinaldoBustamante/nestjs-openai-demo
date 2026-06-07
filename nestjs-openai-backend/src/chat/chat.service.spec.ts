import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { OpenaiService } from './openai/openai.service';
import { HttpException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let openaiService: OpenaiService;

  const mockOpenaiService = {
    get_responses: jest.fn(),
    get_responses_with_context: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: OpenaiService,
          useValue: mockOpenaiService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    openaiService = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get_responses', () => {
    it('should successfully get response from OpenaiService', async () => {
      const prompt = 'Test prompt';
      const expectedResponse = 'Test response';
      mockOpenaiService.get_responses.mockResolvedValue(expectedResponse);

      const result = await service.get_responses(prompt);

      expect(mockOpenaiService.get_responses).toHaveBeenCalledWith(prompt);
      expect(result).toEqual({ response: expectedResponse });
    });

    it('should throw HttpException 429 if OpenaiService fails with 429 status', async () => {
      const prompt = 'Test prompt';
      const error: any = new Error('Too many requests');
      error.status = 429;
      mockOpenaiService.get_responses.mockRejectedValue(error);

      await expect(service.get_responses(prompt)).rejects.toThrow(HttpException);
      await expect(service.get_responses(prompt)).rejects.toThrow('Too many requests');
    });

    it('should throw Error if OpenaiService fails with general error', async () => {
      const prompt = 'Test prompt';
      mockOpenaiService.get_responses.mockRejectedValue(new Error('General Error'));

      await expect(service.get_responses(prompt)).rejects.toThrow('Internal server error');
    });
  });

  describe('get_responses_with_context', () => {
    it('should successfully get response with context from OpenaiService', async () => {
      const prompt = 'Test prompt';
      const userId = 'user123';
      const expectedResponse = 'Test response with context';
      mockOpenaiService.get_responses_with_context.mockResolvedValue(expectedResponse);

      const result = await service.get_responses_with_context(prompt, userId);

      expect(mockOpenaiService.get_responses_with_context).toHaveBeenCalledWith(prompt, userId);
      expect(result).toEqual({ response: expectedResponse });
    });

    it('should throw HttpException 429 if OpenaiService fails with 429 status', async () => {
      const prompt = 'Test prompt';
      const userId = 'user123';
      const error: any = new Error('Too many requests');
      error.status = 429;
      mockOpenaiService.get_responses_with_context.mockRejectedValue(error);

      await expect(service.get_responses_with_context(prompt, userId)).rejects.toThrow(HttpException);
    });

    it('should throw Error if OpenaiService fails with general error', async () => {
      const prompt = 'Test prompt';
      const userId = 'user123';
      mockOpenaiService.get_responses_with_context.mockRejectedValue(new Error('General Error'));

      await expect(service.get_responses_with_context(prompt, userId)).rejects.toThrow('Internal server error');
    });
  });
});
