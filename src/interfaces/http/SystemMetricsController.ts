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


        return await this.getSystemMetricsUseCase

            .execute();


    }


}