import { GoldPrice } from "../value-objects/GoldPrice";
import { GoldWeight } from "../value-objects/GoldWeight";
import { Labor } from "../value-objects/Labor";
import { Profit } from "../value-objects/Profit";
import { Tax } from "../value-objects/Tax";
import { Discount } from "../value-objects/Discount";
import { CalculationResult } from "../calculator/CalculationResult";
import { Money } from "../value-objects/Money";


export class GoldCalculatorService {


  calculate(input: {

    weight: GoldWeight;

    price: GoldPrice;

    labor: Labor;

    profit: Profit;

    tax: Tax;

    discount: Discount;

  }): CalculationResult {


    /*
     * Step 1:
     * Calculate raw gold value
     *
     * weight × price per gram
     */
    const goldValue =
      input.price.calculate(
        input.weight.getGrams()
      );


    /*
     * Step 2:
     * Labor calculation
     */
    const laborAmount =
      input.labor.calculate(
        goldValue
      );


    /*
     * Step 3:
     * Profit calculation
     *
     * Profit applies on:
     * gold + labor
     */
    const profitBase =
      goldValue.add(
        laborAmount
      );


    const profitAmount =
      Money.create(
        input.profit.calculate(
          profitBase.getAmount()
        ),
        profitBase.getCurrency()
      );


    /*
     * Step 4:
     * Tax calculation
     *
     * Tax applies on:
     * labor + profit
     */
    const taxBase =
      laborAmount.add(
        profitAmount
      );


    const taxAmount =
      Money.create(
        input.tax.calculate(
          taxBase.getAmount()
        ),
        taxBase.getCurrency()
      );


    /*
     * Step 5:
     * Calculate subtotal
     */
    const subtotal =
      goldValue
        .add(laborAmount)
        .add(profitAmount)
        .add(taxAmount);


    /*
     * Step 6:
     * Discount
     */
    const discountAmount =
      Money.create(
        input.discount.calculate(
          subtotal.getAmount()
        ),
        subtotal.getCurrency()
      );


    /*
     * Step 7:
     * Final price
     */
    const finalAmount =
      subtotal.subtract(
        discountAmount
      );


    return new CalculationResult(

      goldValue,

      laborAmount,

      profitAmount,

      taxAmount,

      discountAmount,

      finalAmount

    );
  }

}