export enum TaxMode {

  NONE = "NONE",

  SEPARATE = "SEPARATE",

  INCLUDED_IN_LABOR = "INCLUDED_IN_LABOR"

}



export class Tax {


  private constructor(

    private readonly percentage: number,

    private readonly mode: TaxMode

  ) {


    if (
      percentage < 0 ||
      percentage > 100
    ) {

      throw new Error(
        "Invalid tax percentage"
      );

    }

  }



  static percentage(

    value: number,

    mode: TaxMode = TaxMode.SEPARATE

  ): Tax {

    return new Tax(
      value,
      mode
    );

  }



  static none(): Tax {

    return new Tax(
      0,
      TaxMode.NONE
    );

  }



  calculate(

    amount: number

  ): number {


    if (
      this.mode === TaxMode.NONE
    ) {

      return 0;

    }


    return (
      amount *
      this.percentage /
      100
    );

  }



  getPercentage(): number {

    return this.percentage;

  }



  getMode(): TaxMode {

    return this.mode;

  }



}