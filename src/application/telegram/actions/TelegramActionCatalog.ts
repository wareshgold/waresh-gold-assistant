export interface TelegramActionDefinition {


    id:
        string;


    command:
        string;


    enabled?:
        boolean;


    callbackEnabled?:
        boolean;


}





export class TelegramActionCatalog {


    private static readonly actions:

        TelegramActionDefinition[] = [



        {
            id:
                "gold.price",

            command:
                "/price",

            callbackEnabled:
                true
        },


        {
            id:
                "gold.bubble",

            command:
                "/bubble",

            callbackEnabled:
                true
        },


        {
            id:
                "gold.reverse-labor",

            command:
                "/reverse-labor",

            callbackEnabled:
                true
        },


        {
            id:
                "market.analytics",

            command:
                "/analytics",

            callbackEnabled:
                true
        },


        {
            id:
                "market.history",

            command:
                "/history",

            callbackEnabled:
                true
        },


        {
            id:
                "market.chart",

            command:
                "/chart",

            callbackEnabled:
                false
        },


        {
            id:
                "calculator.gold-price",

            command:
                "/calc",

            callbackEnabled:
                true
        },


        {
            id:
                "calculator.invoice",

            command:
                "/invoice",

            callbackEnabled:
                true
        },


        {
            id:
                "calculator.formula",

            command:
                "/formula",

            callbackEnabled:
                true
        },


        {
            id:
                "calculator.reverse-labor",

            command:
                "/reverse-labor",

            callbackEnabled:
                true
        },


        {
            id:
                "calculator.history",

            command:
                "/calc-history",

            callbackEnabled:
                true
        },


        {
            id:
                "assistant.ai",

            command:
                "/help",

            callbackEnabled:
                true
        },


        {
            id:
                "assistant.learn",

            command:
                "/help",

            callbackEnabled:
                true
        },


        {
            id:
                "assistant.help",

            command:
                "/help",

            callbackEnabled:
                true
        },


        {
            id:
                "settings.alerts",

            command:
                "/help",

            callbackEnabled:
                true
        },


        {
            id:
                "settings.account",

            command:
                "/help",

            callbackEnabled:
                true
        },


        {
            id:
                "settings.bot",

            command:
                "/help",

            callbackEnabled:
                true
        }


    ];





    static getAll():

        TelegramActionDefinition[] {


        return [
            ...this.actions
        ];


    }






    static getCallbackActions():

        TelegramActionDefinition[] {


        return this.actions.filter(

            action =>

                action.callbackEnabled === true

        );


    }








    static find(

        id:

            string

    ):

        TelegramActionDefinition | undefined {



        return this.actions.find(

            action =>

                action.id === id

        );


    }



}