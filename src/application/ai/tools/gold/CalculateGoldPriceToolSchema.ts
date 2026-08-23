import {
    z
} from "zod";



export const CalculateGoldPriceToolSchema =

    z.object({

        weight:

            z.number()
                .positive(
                    "Weight must be greater than zero"
                ),



        goldPrice:

            z.number()
                .positive(
                    "Gold price must be greater than zero"
                ),



        laborPercent:

            z.number()
                .min(
                    0,
                    "Labor percent cannot be negative"
                ),



        profitPercent:

            z.number()
                .min(
                    0,
                    "Profit percent cannot be negative"
                )
                .default(0),



        taxPercent:

            z.number()
                .min(
                    0,
                    "Tax percent cannot be negative"
                )
                .default(0),



        discount:

            z.number()
                .min(
                    0,
                    "Discount cannot be negative"
                )
                .optional()

    });
