import { HealthCheckService }
from "../../application/system/HealthCheckService";




export class SystemHealthController {



    constructor(

        private readonly healthCheckService:
            HealthCheckService

    ) {}





    async handle() {


        return await this.healthCheckService

            .execute();


    }



}