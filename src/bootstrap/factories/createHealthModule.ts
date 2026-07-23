import {
    HealthCheckService
}
from "../../application/health/HealthCheckService";



import {
    HealthController
}
from "../../interfaces/http/HealthController";



export interface HealthModule {


    healthCheckService:
        HealthCheckService;



    healthController:
        HealthController;


}





export function createHealthModule()

:
HealthModule {



    const healthCheckService =

        new HealthCheckService();



    const healthController =

        new HealthController(

            healthCheckService

        );



    return {


        healthCheckService,


        healthController


    };


}