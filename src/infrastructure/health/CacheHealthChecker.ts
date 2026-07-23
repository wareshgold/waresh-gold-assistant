import { HealthChecker }
from "../../application/system/GetSystemHealthUseCase";


import { ComponentHealth }
from "../../domain/system/health/ComponentHealth";


import { CacheStore }
from "../cache/CacheStore";



export class CacheHealthChecker
implements HealthChecker {



    constructor(

        private readonly cache:
            CacheStore

    ) {}





    async check():
        Promise<ComponentHealth> {


        try {


            const key =
                "health:check";



            await this.cache.set(

                key,

                {

                    ok:true

                },

                30

            );



            const value =

                await this.cache.get<{

                    ok:boolean

                }>(

                    key

                );



            await this.cache.delete(

                key

            );



            if(value?.ok){


                return ComponentHealth.healthy(

                    "cache"

                );


            }



            return ComponentHealth.degraded(

                "cache",

                "Cache write/read failed"

            );


        }

        catch(error){


            return ComponentHealth.down(

                "cache",

                error instanceof Error

                    ? error.message

                    : "Cache unavailable"

            );


        }


    }



}