import { Money } from "../value-objects/Money";
import { GoldWeight } from "../value-objects/GoldWeight";
import { GoldPrice } from "../value-objects/GoldPrice";
import { TaxMode } from "../value-objects/Tax";


export interface CalculationInput {


  weight?: GoldWeight;


  goldPrice?: GoldPrice;


  finalAmount?: Money;


  labor?: number;


  profit?: number;


  tax?: number;


  taxMode?: TaxMode;


  discount?: Money;


}