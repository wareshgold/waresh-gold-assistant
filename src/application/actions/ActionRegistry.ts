import {
    ActionDefinition
}
from "./ActionDefinition";


import {
    ActionHandler
}
from "./ActionHandler";





export interface ActionRegistry {



    register(

        definition:

            ActionDefinition,


        handler:

            ActionHandler

    ):

        void;






    getDefinition(

        id:

            string

    ):

        ActionDefinition | undefined;






    getHandler(

        id:

            string

    ):

        ActionHandler | undefined;



}