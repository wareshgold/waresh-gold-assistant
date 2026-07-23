import { SystemMonitoringService }
from "./observability/SystemMonitoringService";



export class GetSystemMetricsUseCase {


    constructor(

        private readonly monitoringService:
            SystemMonitoringService

    ) {}



    execute() {


        return {

            metrics:

                this.monitoringService
                    .getAll(),


            generatedAt:

                new Date()

        };


    }


}