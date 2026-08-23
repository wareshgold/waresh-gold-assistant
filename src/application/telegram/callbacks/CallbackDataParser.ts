import {
    CallbackAction,
    CallbackNamespace,
}
from "./CallbackAction";







export class CallbackDataParser {







    parse(

        data:

            string

    ):

        CallbackAction {





        const parts =

            data

                .split(":");







        const namespace =

            parts.shift();







        const action =

            parts.shift();









        return {



            namespace:

                this.resolveNamespace(

                    namespace

                ),






            action:

                action

                ??

                "",






            payload:

                parts.length > 0

                    ?

                    parts.join(":")

                    :

                    undefined



        };



    }









    private resolveNamespace(

        value:

            string | undefined

    ):

        CallbackNamespace {





        if (

            Object.values(

                CallbackNamespace

            )

            .includes(

                value as CallbackNamespace

            )

        ) {



            return value as CallbackNamespace;



        }








        return CallbackNamespace.SYSTEM;



    }





}