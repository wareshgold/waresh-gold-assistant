import { CalculationInput } from "./CalculationInput";
import { CalculationField } from "./CalculationField";


export class MissingFieldsDetector {


 detect(
  input: CalculationInput
 ): CalculationField[] {


  const missing: CalculationField[] = [];


  if(!input.weight){
    missing.push(
      CalculationField.WEIGHT
    );
  }


  if(!input.goldPrice){
    missing.push(
      CalculationField.GOLD_PRICE
    );
  }


  return missing;

 }

}