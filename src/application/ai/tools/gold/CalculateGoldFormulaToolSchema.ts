import { z } from "zod";


export const CalculateGoldFormulaToolSchema =

    z.object({

        weight:

            z.number()
                .positive(),


        goldPrice:

            z.number()
                .positive(),


        laborPercent:

            z.number()
                .min(0),


        profitPercent:

            z.number()
                .min(0),


        taxPercent:

            z.number()
                .min(0)
                .optional(),


        discount:

            z.number()
                .min(0)
                .optional()

    });