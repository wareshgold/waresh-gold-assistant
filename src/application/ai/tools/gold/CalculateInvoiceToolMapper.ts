import {
    CalculateInvoiceInput
} from "../../../gold/CalculateInvoiceUseCase";


import {
    InvoiceItem
} from "../../../../domain/gold/entities/InvoiceItem";


import {
    GoldItem
} from "../../../../domain/gold/entities/GoldItem";


import {
    GoldWeight
} from "../../../../domain/gold/value-objects/GoldWeight";


import {
    GoldPrice
} from "../../../../domain/gold/value-objects/GoldPrice";


import {
    Money
} from "../../../../domain/gold/value-objects/Money";


import {
    Labor
} from "../../../../domain/gold/value-objects/Labor";


import {
    Profit
} from "../../../../domain/gold/value-objects/Profit";


import {
    Tax
} from "../../../../domain/gold/value-objects/Tax";


import {
    Discount
} from "../../../../domain/gold/value-objects/Discount";



interface InvoiceItemInput {


    weight: number;


    goldPrice: number;


    laborPercent: number;


    profitPercent: number;


    taxPercent: number;


    discountPercent?: number;


}





export class CalculateInvoiceToolMapper {



    map(

        input: {

            items: InvoiceItemInput[];

        }

    ):

        CalculateInvoiceInput {



        return {


            items:

                input.items.map(

                    item =>

                        this.mapItem(

                            item

                        )

                )


        };


    }





    private mapItem(

        item: InvoiceItemInput

    ):

        InvoiceItem {



        const gold =

            new GoldItem(

                GoldWeight.create(

                    item.weight

                ),


                GoldPrice.create(

                    Money.create(

                        item.goldPrice

                    )

                )

            );





        return new InvoiceItem(

            gold,


            Labor.percentage(

                item.laborPercent

            ),


            Profit.percentage(

                item.profitPercent

            ),


            Tax.percentage(

                item.taxPercent

            ),


            Discount.percentage(

                item.discountPercent ?? 0

            )

        );


    }


}