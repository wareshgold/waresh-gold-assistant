export interface HealthCheckResult {


    status:
        "healthy"
        |
        "unhealthy";



    service:
        string;



    timestamp:
        Date;



    checks:
        Record<
            string,
            {
                status:
                    "ok"
                    |
                    "failed";

                message?:
                    string;
            }
        >;



}



export interface HealthCheckProvider {


    name:
        string;



    check():
        Promise<{

            status:
                "ok"
                |
                "failed";


            message?:
                string;

        }>;


}




export class HealthCheckService {



    constructor(

        private readonly providers:
            HealthCheckProvider[] = []

    ) {}





    async execute():
        Promise<HealthCheckResult> {



        const checks:
            Record<
                string,
                {
                    status:
                        "ok"
                        |
                        "failed";

                    message?:
                        string;
                }
            > = {};



        let overallStatus:
            "healthy"
            |
            "unhealthy"
            =
            "healthy";





        for(
            const provider
            of this.providers
        ){


            try {


                const result =

                    await provider.check();



                checks[
                    provider.name
                ] = result;



                if(
                    result.status === "failed"
                ){

                    overallStatus =
                        "unhealthy";

                }



            }
            catch(error){


                overallStatus =
                    "unhealthy";



                checks[
                    provider.name
                ] = {

                    status:
                        "failed",


                    message:

                        error instanceof Error

                            ?
                            error.message

                            :
                            "Unknown error"

                };


            }


        }





        return {


            status:
                overallStatus,



            service:
                "waresh-gold-assistant",



            timestamp:
                new Date(),



            checks


        };



    }



}