import { HealthMetric }
from "../../../domain/system/observability/HealthMetric";


export interface SystemMetricsReport {


    summary: {

        requests:
            number;


        requestDuration:
            number;


        marketFetchSuccess:
            number;


        marketFetchFailure:
            number;


        marketFetchDuration:
            number;


        cacheHits:
            number;


        cacheMisses:
            number;


        cacheErrors:
            number;

    };


    items:
        HealthMetric[];


}