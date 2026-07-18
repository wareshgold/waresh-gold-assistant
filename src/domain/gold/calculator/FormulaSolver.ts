import { CalculationInput } from "./CalculationInput";
import { CalculationStatus } from "./CalculationStatus";


export interface FormulaSolveResult {

  status: CalculationStatus;

  calculatedFields: string[];

  missingFields: string[];

}



export class FormulaSolver {


 solve(
  input: CalculationInput
 ): FormulaSolveResult {


  const calculatedFields: string[] = [];

  const missingFields: string[] = [];


  if(
    input.weight &&
    input.goldPrice
  ){

    calculatedFields.push(
      "goldValue"
    );

  }
  else {

    if(!input.weight){
      missingFields.push(
        "weight"
      );
    }


    if(!input.goldPrice){
      missingFields.push(
        "goldPrice"
      );
    }

  }


  return {

    status:
      missingFields.length === 0
      ? CalculationStatus.READY
      : CalculationStatus.MISSING_INFORMATION,


    calculatedFields,

    missingFields

  };

 }

}