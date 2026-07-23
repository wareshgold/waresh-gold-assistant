import { HealthMetric }
from "../../domain/system/observability/HealthMetric";



export interface MetricsStore {


    save(

        metric:
            HealthMetric

    ):
    Promise<void>;



    getAll():

    Promise<HealthMetric[]>;


}





export class MemoryMetricsStore

implements MetricsStore {


    private readonly metrics:

        HealthMetric[] = [];




    async save(

        metric:
            HealthMetric

    ):
    Promise<void> {


        this.metrics.push(

            metric

        );


    }




    async getAll():

    Promise<HealthMetric[]> {


        return [

            ...this.metrics

        ];


    }



}