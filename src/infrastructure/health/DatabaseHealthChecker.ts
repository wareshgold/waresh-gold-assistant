import { HealthChecker }
from "../../application/system/GetSystemHealthUseCase";


import { ComponentHealth }
from "../../domain/system/health/ComponentHealth";



export class DatabaseHealthChecker
implements HealthChecker {



    async check():
        Promise<ComponentHealth> {


        return ComponentHealth.healthy(

            "database",

            "Database checker not connected yet"

        );


    }



}