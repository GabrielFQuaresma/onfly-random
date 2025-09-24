import { Random } from '../src/Random.node';
import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Mock global fetch
global.fetch = jest.fn();

describe('Random Node', () => {
  const mockExecuteFunctions = {
    getNodeParameter: jest.fn(),
    getInputData: jest.fn().mockReturnValue([{}]), // retorna 1 item de entrada
    getNode: jest.fn().mockReturnValue({ name: 'Random' }), // mock para this.getNode()
  } as unknown as IExecuteFunctions;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar um número aleatório dentro do intervalo', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => '5',
    });

    mockExecuteFunctions.getNodeParameter = jest.fn()
      .mockImplementation((name: string) => {
        if (name === 'min') return 1;
        if (name === 'max') return 10;
      });

    const node = new Random();
    const result = await node.execute.call(mockExecuteFunctions);

    const value = result[0][0].json.random_number;
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  it('deve lançar erro se min > max', async () => {
    mockExecuteFunctions.getNodeParameter = jest.fn()
      .mockImplementation((name: string) => {
        if (name === 'min') return 10;
        if (name === 'max') return 1;
      });

    const node = new Random();
    await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Min deve ser <= Max');
  });

  it('deve lançar erro se fetch retornar status não ok', async () => {
    mockExecuteFunctions.getNodeParameter = jest.fn()
      .mockImplementation((name: string) => {
        if (name === 'min') return 1;
        if (name === 'max') return 10;
      });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Erro',
    });

    const node = new Random();
    await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Falha na requisição, erro: 500');
  });

  it('deve lançar erro se valor retornado não for número', async () => {
    mockExecuteFunctions.getNodeParameter = jest.fn()
      .mockImplementation((name: string) => {
        if (name === 'min') return 1;
        if (name === 'max') return 10;
      });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => 'abc',
    });

    const node = new Random();
    await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Resultado da requisição não é um numero');
  });
});
