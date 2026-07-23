import { HealthMetric }
from "../../../domain/system/observability/HealthMetric";


import { MetricType }
from "../../../domain/system/observability/MetricType";



export interface MetricsStore {


    save(

        metric:
            HealthMetric

    ):
    Promise<void>;



    getAll():

    Promise<HealthMetric[]>;


}





export class SystemMonitoringService {



    constructor(

        private readonly metricsStore:
            MetricsStore

    ) {}





    async record(

        type:
            MetricType,


        value:
            number

    ):
    Promise<HealthMetric> {


        const metric =

            HealthMetric.create(

                type,

                value

            );



        await this.metricsStore.save(

            metric

        );



        return metric;


    }





    async getAll():

    Promise<HealthMetric[]> {


        return await this.metricsStore.getAll();


    }



}