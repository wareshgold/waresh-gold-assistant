import {
    z
} from "zod";



export const CalculateInvoiceToolSchema =

    z.object({

        items:

            z.array(

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
                            )
                            .max(
                                100,
                                "Labor percent cannot exceed 100"
                            )
                            .default(
                                0
                            ),



                    profitPercent:

                        z.number()
                            .min(
                                0,
                                "Profit percent cannot be negative"
                            )
                            .max(
                                100,
                                "Profit percent cannot exceed 100"
                            )
                            .default(
                                0
                            ),



                    taxPercent:

                        z.number()
                            .min(
                                0,
                                "Tax percent cannot be negative"
                            )
                            .max(
                                100,
                                "Tax percent cannot exceed 100"
                            )
                            .default(
                                0
                            ),



                    discountPercent:

                        z.number()
                            .min(
                                0,
                                "Discount percent cannot be negative"
                            )
                            .max(
                                100,
                                "Discount percent cannot exceed 100"
                            )
                            .default(
                                0
                            )

                })

            )
            .min(
                1,
                "Invoice must contain at least one item"
            )

    });