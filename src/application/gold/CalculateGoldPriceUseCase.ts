import { GoldRuleEngine } from "../../domain/gold/services/GoldRuleEngine";


export interface CalculateGoldPriceInput {

  weight: number;

  goldPrice: number;

  laborPercent: number;

  profitPercent: number;

  taxPercent: number;

  discount?: number;

}


export interface CalculateGoldPriceOutput {

  total: number;

}



export class CalculateGoldPriceUseCase {


  constructor(
    private readonly engine: GoldRuleEngine
  ) {}



  execute(
    input: CalculateGoldPriceInput
  ): CalculateGoldPriceOutput {


    const result =
      this.engine.execute(input);



    return {

      total:
        result.finalPrice

    };

  }

}