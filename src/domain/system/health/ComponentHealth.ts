import { HealthStatus }
from "./HealthStatus";



export class ComponentHealth {



    constructor(

        public readonly name:
            string,


        public readonly status:
            HealthStatus,


        public readonly message?:
            string,


        public readonly checkedAt:
            Date = new Date()

    ) {}





    static healthy(

        name:
            string,

        message?:
            string

    ): ComponentHealth {


        return new ComponentHealth(

            name,

            HealthStatus.HEALTHY,

            message

        );


    }





    static degraded(

        name:
            string,

        message?:
            string

    ): ComponentHealth {


        return new ComponentHealth(

            name,

            HealthStatus.DEGRADED,

            message

        );


    }





    static down(

        name:
            string,

        message?:
            string

    ): ComponentHealth {


        return new ComponentHealth(

            name,

            HealthStatus.DOWN,

            message

        );


    }



}