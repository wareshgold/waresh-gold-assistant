import { ComponentHealth }
from "./ComponentHealth";


import { HealthStatus }
from "./HealthStatus";




export class SystemHealth {



    constructor(

        public readonly components:
            ComponentHealth[],


        public readonly checkedAt:
            Date = new Date()

    ) {}





    get status():
        HealthStatus {


        if (

            this.components.some(

                component =>

                    component.status ===
                    HealthStatus.DOWN

            )

        ) {

            return HealthStatus.DOWN;

        }





        if (

            this.components.some(

                component =>

                    component.status ===
                    HealthStatus.DEGRADED

            )

        ) {

            return HealthStatus.DEGRADED;

        }





        return HealthStatus.HEALTHY;


    }





}