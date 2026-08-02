import { GoldCalculationHistory }
from "../../../../domain/gold/entities/GoldCalculationHistory";


import { GoldCalculationHistoryRepository }
from "../../../../domain/gold/repositories/GoldCalculationHistoryRepository";







export class D1GoldCalculationHistoryRepository

implements GoldCalculationHistoryRepository {



    constructor(

        private readonly db:

            D1Database

    ) {}







    async save(

        history:

            GoldCalculationHistory

    ):
    Promise<void> {



        await this.db

            .prepare(

`
INSERT INTO gold_calculation_history
(
    user_id,
    weight,
    gold_price,
    labor_percent,
    profit_percent,
    tax_percent,
    discount,
    gold_value,
    labor,
    profit,
    tax,
    final_price,
    created_at
)

VALUES
(
    ?,?,?,?,?,?,?,?,?,?,?,?,?
)
`

            )

            .bind(


                history.userId,


                history.input.weight ?? 0,


                history.input.goldPrice ?? 0,


                history.input.laborPercent ?? 0,


                history.input.profitPercent ?? 0,


                history.input.taxPercent ?? 0,


                history.input.discount ?? 0,


                history.result.goldValue,


                history.result.labor,


                history.result.profit,


                history.result.tax,


                history.result.finalPrice,


                history.createdAt.getTime()


            )

            .run();


    }








    async getByUserId(

        userId: string,

        limit: number = 10

    ):
    Promise<GoldCalculationHistory[]> {



        const result =

            await this.db

                .prepare(

`
SELECT *

FROM gold_calculation_history

WHERE user_id = ?

ORDER BY created_at DESC

LIMIT ?
`

                )

                .bind(

                    userId,

                    limit

                )

                .all<any>();







        return (

            result.results ?? []

        )

        .map(


            row =>


                new GoldCalculationHistory(


                    row.user_id,


                    {


                        weight:

                            Number(row.weight),


                        goldPrice:

                            Number(row.gold_price),


                        laborPercent:

                            Number(row.labor_percent),


                        profitPercent:

                            Number(row.profit_percent),


                        taxPercent:

                            Number(row.tax_percent),


                        discount:

                            Number(row.discount)


                    },



                    {


                        goldValue:

                            Number(row.gold_value),


                        labor:

                            Number(row.labor),


                        profit:

                            Number(row.profit),


                        tax:

                            Number(row.tax),


                        finalPrice:

                            Number(row.final_price)


                    },


                    new Date(

                        Number(row.created_at)

                    )


                )


        );


    }



}