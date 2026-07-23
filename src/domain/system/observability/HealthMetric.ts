import { MetricType }
from "./MetricType";



export class HealthMetric {


    constructor(

        public readonly type:
            MetricType,


        public readonly value:
            number,


        public readonly createdAt:
            Date

    ) {}



    static create(

        type: MetricType,

        value: number

    ):
    HealthMetric {


        return new HealthMetric(

            type,

            value,

            new Date()

        );


    }



}