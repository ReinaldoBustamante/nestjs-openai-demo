import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';

const mockResponsesCreate = jest.fn();

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      responses: {
        create: mockResponsesCreate,
      },
    };
  });
});

describe('OpenaiService', () => {
  let service: OpenaiService;

  beforeEach(async () => {
    mockResponsesCreate.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get_responses', () => {
    it('should call openaiClient.responses.create and calculate price', async () => {
      const prompt = 'Hola';
      const expectedOutput = 'Hola, ¿cómo estás?';

      mockResponsesCreate.mockResolvedValue({
        output_text: expectedOutput,
        usage: {
          input_tokens: 10,
          output_tokens: 20,
        },
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.get_responses(prompt);

      expect(mockResponsesCreate).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: prompt }],
        max_output_tokens: 100,
      });
      expect(result).toBe(expectedOutput);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Total: ${10 * (0.05 / 1000000) + 20 * (0.4 / 1000000)}$`
      );

      consoleSpy.mockRestore();
    });
  });

  describe('get_responses_with_context', () => {
    it('should call openaiClient.responses.create with complete context', async () => {
      const prompt = '¿Cuál es la tendencia?';
      const expectedOutput = 'Tendencias en IA';

      mockResponsesCreate.mockResolvedValue({
        output_text: expectedOutput,
        usage: {
          input_tokens: 50,
          output_tokens: 15,
        },
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.get_responses_with_context(prompt, 'user123');

      expect(mockResponsesCreate).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        input: [
          { role: 'system', content: 'Eres un asistente virtual, si te insultan da respuestas como: Hey!, no deberias decir eso' },
          { role: 'system', content: 'Como resumen, le usuario se llama reinaldo, tiene 28 años y vive en valdivia, su perfil es desarrollador backend con foco en ia' },
          { role: 'user', content: 'Que tendencia hay actualmente' },
          { role: 'assistant', content: 'Actualmente esta creciendo mucho las herramientas de inteligencia artificial como antigravity, que ayuda a los desarrolladores a ser mas productivos' },
          { role: 'user', content: prompt },
        ],
        max_output_tokens: 100,
      });
      expect(result).toBe(expectedOutput);
      
      consoleSpy.mockRestore();
    });
  });
});
