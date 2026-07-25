import {
    TelegramActionResolver
}
from "./TelegramActionResolver";



export class CompositeTelegramActionResolver
implements TelegramActionResolver {



    constructor(

        private readonly resolvers:
            TelegramActionResolver[]

    ) {}





    resolve(

        actionId:
            string

    ): string | undefined {



        for (

            const resolver of this.resolvers

        ) {


            const result =

                resolver.resolve(

                    actionId

                );



            if (result) {


                return result;


            }


        }





        return undefined;


    }



}