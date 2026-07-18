import { GoldItem } from "../../domain/gold/entities/GoldItem";
import { Money } from "../../domain/gold/value-objects/Money";
import { GoldPrice } from "../../domain/gold/value-objects/GoldPrice";
import { GoldWeight } from "../../domain/gold/value-objects/GoldWeight";
import { Percentage } from "../../domain/gold/value-objects/Percentage";
import { createGoldRuleEngine } from "../../domain/gold/services/createGoldRuleEngine";


export interface CalculateGoldPriceInput {
  weight: number;
  goldPrice: number;
  laborPercent: number;
  profitPercent: number;
  taxPercent: number;
}


export interface CalculateGoldPriceOutput {
  total: number;
}


export class CalculateGoldPriceUseCase {

  private readonly engine;

  constructor() {
    this.engine = createGoldRuleEngine();
  }


  execute(
    input: CalculateGoldPriceInput
  ): CalculateGoldPriceOutput {


    const goldItem = new GoldItem({

      weight: new GoldWeight(input.weight),

      price:
        new GoldPrice(
          new Money(input.goldPrice)
        ),

      labor:
        new Percentage(input.laborPercent),

      profit:
        new Percentage(input.profitPercent),

      tax:
        new Percentage(input.taxPercent)

    });


    const result =
      this.engine.calculate(goldItem);


    return {
      total: result.total.amount
    };
  }

}