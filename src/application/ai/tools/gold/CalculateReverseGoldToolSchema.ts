import {
    z
} from "zod";



export const CalculateReverseGoldToolSchema =

    z.object({

        target:

            z.enum([

                "GOLD_PRICE",

                "WEIGHT",

                "LABOR_PERCENT"

            ]),


        finalPrice:

            z.number()
                .positive(),


        goldPrice:

            z.number()
                .positive()
                .optional(),


        weight:

            z.number()
                .positive()
                .optional(),


        laborPercent:

            z.number()
                .min(0)
                .optional(),


        profitPercent:

            z.number()
                .min(0)
                .optional()
                .default(0),


        taxPercent:

            z.number()
                .min(0)
                .optional()
                .default(0),


        discount:

            z.number()
                .min(0)
                .optional()
                .default(0)

    });