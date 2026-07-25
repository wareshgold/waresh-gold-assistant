import {
    SystemMonitoringService
}
from "../../application/system/observability/SystemMonitoringService";


import {
    D1MetricsStore
}
from "../../infrastructure/system/observability/d1/D1MetricsStore";


import {
    AppEnv
}
from "../../shared/config/env";




export interface MonitoringModule {


    monitoringService:
        SystemMonitoringService;



    metricsStore:
        D1MetricsStore;



}






export function createMonitoringModule(

    env:
        AppEnv

):

MonitoringModule {



    const metricsStore =

        new D1MetricsStore(

            env.waresh_gold_db

        );






    const monitoringService =

        new SystemMonitoringService(

            metricsStore

        );







    return {


        monitoringService,


        metricsStore



    };



}