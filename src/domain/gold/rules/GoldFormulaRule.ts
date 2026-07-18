export interface GoldFormulaRule {

  name: string;


  calculate(
    input: Record<string, number>
  ): number;


}