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




const metricsStore =

    new MemoryMetricsStore();




const monitoringService =

    new SystemMonitoringService(

        metricsStore

    );






export function createMonitoringModule()

:
MonitoringModule {


    return {


        monitoringService,


        metricsStore


    };


}