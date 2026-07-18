export interface ParsedMarketPrice {
  gold18Price: number;
  currencyPrice: number;
}


export class TelegramPriceParser {


  static parse(
    message: string
  ): ParsedMarketPrice {


    const goldMatch =
      message.match(
        /طلای\s*۱۸\s*عیار:\s*([\d,]+)/
      );


    const currencyMatch =
      message.match(
        /دلار\s*تهران:\s*([\d,]+)/
      );



    if (!goldMatch || !currencyMatch) {

      throw new Error(
        "Invalid telegram price message"
      );

    }



    return {

      gold18Price:
        Number(
          goldMatch[1]
            .replace(/,/g, "")
        ),


      currencyPrice:
        Number(
          currencyMatch[1]
            .replace(/,/g, "")
        )

    };

  }

}