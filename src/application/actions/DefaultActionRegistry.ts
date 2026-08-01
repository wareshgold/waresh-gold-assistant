import {
    ActionDefinition
}
from "./ActionDefinition";


import {
    ActionHandler
}
from "./ActionHandler";


import {
    ActionRegistry
}
from "./ActionRegistry";






interface RegisteredAction {


    definition:

        ActionDefinition;


    handler:

        ActionHandler;


}







export class DefaultActionRegistry

implements ActionRegistry {



    private readonly actions:

        Map<string, RegisteredAction>;





    constructor() {


        this.actions =

            new Map();


    }







    register(


        definition:

            ActionDefinition,


        handler:

            ActionHandler


    ):

        void {


        this.actions.set(

            definition.id,

            {

                definition,

                handler

            }

        );


    }








    getDefinition(

        id:

            string

    ):

        ActionDefinition | undefined {



        return this.actions.get(id)

            ?.definition;


    }








    getHandler(

        id:

            string

    ):

        ActionHandler | undefined {



        return this.actions.get(id)

            ?.handler;


    }



}