import {
    HealthMetric
}
from "../../../domain/system/observability/HealthMetric";


import {
    MetricType
}
from "../../../domain/system/observability/MetricType";


import {
    MetricRecorder
}
from "./MetricRecorder";




export interface MetricsStore {


    save(

        metric:
            HealthMetric

    ):
    Promise<void>;



    getAll():

    Promise<HealthMetric[]>;


}






export class SystemMonitoringService

implements MetricRecorder {



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
    Promise<void> {



        const metric =

            HealthMetric.create(

                type,

                value

            );



        await this.metricsStore.save(

            metric

        );


    }





    async getAll():

    Promise<HealthMetric[]> {


        return await this.metricsStore.getAll();


    }



}