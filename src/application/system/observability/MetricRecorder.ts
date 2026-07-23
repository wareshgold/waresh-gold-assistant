import {
    MetricType
}
from "../../../domain/system/observability/MetricType";



export interface MetricRecorder {


    record(

        type:
            MetricType,


        value:
            number

    ):
    Promise<void>;


}