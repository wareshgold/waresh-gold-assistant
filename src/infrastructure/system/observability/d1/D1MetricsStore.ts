import { HealthMetric }
from "../../../../domain/system/observability/HealthMetric";


import { MetricsStore }
from "../../../../application/system/observability/SystemMonitoringService";





export class D1MetricsStore

implements MetricsStore {



    constructor(

        private readonly db:
            D1Database

    ) {}







    async save(

        metric:
            HealthMetric

    ):
    Promise<void> {



        await this.db

            .prepare(

                `
                INSERT INTO system_metrics
                (
                    type,
                    value,
                    created_at
                )

                VALUES
                (?, ?, ?)
                `

            )

            .bind(

                metric.type,

                metric.value,

                metric.createdAt.toISOString()

            )

            .run();



    }









    async getAll():

    Promise<HealthMetric[]> {



        const result =

            await this.db

                .prepare(

                    `
                    SELECT *

                    FROM system_metrics

                    ORDER BY created_at DESC
                    `

                )

                .all<any>();






        return (

            result.results ?? []

        )

        .map(

            row =>

                new HealthMetric(

                    row.type,

                    Number(row.value),

                    new Date(
                        row.created_at
                    )

                )

        );



    }



}