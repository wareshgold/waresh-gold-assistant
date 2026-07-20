import { ReverseGoldCalculator } from "../../domain/gold/calculator/ReverseGoldCalculator";
import { ReverseCalculationInput } from "../../domain/gold/calculator/models/ReverseCalculationInput";


export interface CalculateReverseGoldOutput {

    goldPrice?: number;

    weight?: number;

}



export class CalculateReverseGoldUseCase {


    constructor(
        private readonly calculator:
            ReverseGoldCalculator
    ) {}



    execute(
        input: ReverseCalculationInput
    ): CalculateReverseGoldOutput {


        return this.calculator.calculate(
            input
        );

    }

}