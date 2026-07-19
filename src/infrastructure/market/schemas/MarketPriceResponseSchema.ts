import { z } from "zod";


export const MarketPriceResponseSchema = z.object({


    gold18Price: z.number().positive(),


    currencyPrice: z.number().positive(),


    ouncePrice: z.number().positive(),


    updatedAt: z.string()


});



export type MarketPriceResponse =
    z.infer<typeof MarketPriceResponseSchema>;