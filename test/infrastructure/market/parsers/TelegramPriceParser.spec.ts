import { describe, expect, it } from "vitest";
import { TelegramPriceParser } from "../../../../src/infrastructure/market/parsers/TelegramPriceParser";


describe(
  "TelegramPriceParser",
  () => {


    it(
      "should parse gold and currency price from telegram message",
      () => {


        const message = `
🔻طلای ۱۸ عیار: 18,306,478 تومان
دلار تهران: 187,790 تومان
ساعت: ۱۵:۳۰
        `;


        const result =
          TelegramPriceParser.parse(message);



        expect(result.gold18Price)
          .toBe(18306478);



        expect(result.currencyPrice)
          .toBe(187790);


      }
    );


  }
);