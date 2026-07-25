import { SystemMonitoringService }
from "./observability/SystemMonitoringService";


import { SystemMetricsReport }
from "./observability/SystemMetricsReport";


import { MetricType }
from "../../domain/system/observability/MetricType";





export class GetSystemMetricsUseCase {



    constructor(

        private readonly monitoringService:
            SystemMonitoringService

    ) {}







    async execute():

    Promise<SystemMetricsReport> {



        const metrics =

            await this.monitoringService

                .getAll();






        const summary = {


            requests:
                0,


            requestDuration:
                0,


            marketFetchSuccess:
                0,


            marketFetchFailure:
                0,


            marketFetchDuration:
                0,


            cacheHits:
                0,


            cacheMisses:
                0,


            cacheErrors:
                0



        };







        for (const metric of metrics) {



            switch(metric.type) {



                case MetricType.HTTP_REQUEST_COUNT:

                    summary.requests += metric.value;

                    break;




                case MetricType.HTTP_REQUEST_DURATION:

                    summary.requestDuration += metric.value;

                    break;




                case MetricType.MARKET_FETCH_SUCCESS:

                    summary.marketFetchSuccess += metric.value;

                    break;




                case MetricType.MARKET_FETCH_FAILURE:

                    summary.marketFetchFailure += metric.value;

                    break;




                case MetricType.MARKET_FETCH_DURATION:

                    summary.marketFetchDuration += metric.value;

                    break;




                case MetricType.CACHE_HIT:

                    summary.cacheHits += metric.value;

                    break;




                case MetricType.CACHE_MISS:

                    summary.cacheMisses += metric.value;

                    break;




                case MetricType.CACHE_ERROR:

                    summary.cacheErrors += metric.value;

                    break;



            }



        }






        return {



            summary,


            items:
                metrics



        };



    }



}