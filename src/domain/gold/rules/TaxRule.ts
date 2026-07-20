import { roundMoney } from "../../../shared/utils/number";
import { TaxMode } from "../value-objects/Tax";



export class TaxRule {


  calculate(input: {

    baseAmount: number;

    taxPercent: number;

    mode?: TaxMode;

  }): number {



    const mode =
      input.mode ??
      TaxMode.SEPARATE;



    if (
      mode === TaxMode.NONE
    ) {

      return 0;

    }



    if (
      mode === TaxMode.INCLUDED_IN_LABOR
    ) {

      return 0;

    }



    return roundMoney(

      input.baseAmount *
      (
        input.taxPercent /
        100
      )

    );

  }


}