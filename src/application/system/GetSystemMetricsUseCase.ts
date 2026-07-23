import { SystemMonitoringService }
from "./observability/SystemMonitoringService";



export class GetSystemMetricsUseCase {



    constructor(

        private readonly monitoringService:
            SystemMonitoringService

    ) {}





    async execute() {


        return await this.monitoringService

            .getAll();


    }


}