export class MarketPrice {


  constructor(

    public readonly gold18Price: number,

    public readonly currencyPrice: number,

    public readonly ouncePrice: number,

    public readonly updatedAt: Date

  ) {



    if (gold18Price <= 0) {

      throw new Error(
        "Gold price must be positive"
      );

    }



    if (currencyPrice <= 0) {

      throw new Error(
        "Currency price must be positive"
      );

    }



    if (ouncePrice <= 0) {

      throw new Error(
        "Ounce price must be positive"
      );

    }


  }


}