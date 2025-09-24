import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Random',
    name: 'random',
    icon: 'file:icons/random-icon.svg', 
    group: ['transform'],
    version: 1,
    description: 'True Random Number Generator (Random.org)',
    defaults: {
      name: 'Random',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Valor Mínimo',
        name: 'min',
        type: 'number',
        typeOptions: { minValue: -2147483648, maxValue: 2147483647 },
        default: 1,
        required: true,
        description: 'Valor mínimo (inclusivo)',
      },
      {
        displayName: 'Valor máximo',
        name: 'max',
        type: 'number',
        typeOptions: { minValue: -2147483648, maxValue: 2147483647 },
        default: 100,
        required: true,
        description: 'Valor máximo (inclusivo)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const returnData: INodeExecutionData[] = [];
    
    const min = this.getNodeParameter('min', 0) as number;
    const max = this.getNodeParameter('max', 0) as number;
    
    if (!Number.isInteger(min) || !Number.isInteger(max)){
        throw new NodeOperationError(this.getNode(), 'Min e Max devem ser inteiros');
    }

    if (min > max){
        throw new NodeOperationError(this.getNode(), 'Min deve ser <= Max')
    }

    const API_URL: string = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
    
    try {
        const response = await fetch(API_URL);
    
        if (!response.ok){
            throw new NodeOperationError(this.getNode(), `Falha na requisição, erro: ${response.status}`);
        }
        
        const text = (await response.text()).trim() as string;
        const value = parseInt(text, 10);
        if (Number.isNaN(value)){
            throw new NodeOperationError(this.getNode(), 'Resultado da requisição não é um numero')
        }
        if (value > max || value < min){
            throw new NodeOperationError(this.getNode(), 'Resultado da requisição está fora do intervalo pedido')
        }
    
        returnData.push({
            json: {random_number: value, min, max}
        });
    } catch (error) {
        throw new NodeOperationError(this.getNode(), `Erro ao buscar número aleatório: ${(error as Error).message}`)
    }


    return [returnData];
  }
}
