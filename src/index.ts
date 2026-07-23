import { createApp }
from "./bootstrap/createApp";


import { createContainer }
from "./bootstrap/createContainer";


import { AppEnv }
from "./shared/config/env";




let cachedContainer:
    ReturnType<typeof createContainer> | null = null;





function getContainer(
    env: AppEnv
) {


    if(!cachedContainer) {


        cachedContainer =
            createContainer(env);


    }


    return cachedContainer;


}







export default {


    async fetch(

        request: Request,

        env: AppEnv,

        ctx: ExecutionContext

    ) {



        const container =

            getContainer(env);




        const app =

            createApp(container);




        return app.fetch(

            request,

            env,

            ctx

        );


    },






    async scheduled(

        event: ScheduledEvent,

        env: AppEnv,

        ctx: ExecutionContext

    ) {



        const container =

            getContainer(env);




        try {



            const price =

                await container

                    .refreshMarketPriceJob

                    .execute();




            console.log(

                "Price refreshed:",

                price

            );



        }

        catch(error) {


            console.error(

                "Price refresh failed:",

                error

            );


            throw error;


        }


    }


};