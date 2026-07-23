import { SystemHealth }
from "../../domain/system/health/SystemHealth";


import { ComponentHealth }
from "../../domain/system/health/ComponentHealth";



export interface HealthChecker {


    check():
        Promise<ComponentHealth>;


}



export class GetSystemHealthUseCase {



    constructor(

        private readonly checkers:
            HealthChecker[]

    ) {}





    async execute():
        Promise<SystemHealth> {


        const components =

            await Promise.all(

                this.checkers.map(

                    checker =>

                        checker.check()

                )

            );



        return new SystemHealth(

            components

        );


    }


}