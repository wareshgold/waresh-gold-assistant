import {
    GetSystemMetricsUseCase
}
from "../../application/system/GetSystemMetricsUseCase";



export class SystemMetricsController {



    constructor(

        private readonly getSystemMetricsUseCase:
            GetSystemMetricsUseCase

    ) {}





    async handle() {



        const metrics =

            await this.getSystemMetricsUseCase

                .execute();





        return metrics;


    }



}