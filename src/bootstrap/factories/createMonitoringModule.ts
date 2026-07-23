import {
    SystemMonitoringService
}
from "../../application/system/observability/SystemMonitoringService";


import {
    MemoryMetricsStore
}
from "../../infrastructure/monitoring/MemoryMetricsStore";



export interface MonitoringModule {


    monitoringService:
        SystemMonitoringService;



    metricsStore:
        MemoryMetricsStore;


}





export function createMonitoringModule()

:
MonitoringModule {



    const metricsStore =

        new MemoryMetricsStore();




    const monitoringService =

        new SystemMonitoringService(

            metricsStore

        );




    return {


        monitoringService,


        metricsStore


    };


}