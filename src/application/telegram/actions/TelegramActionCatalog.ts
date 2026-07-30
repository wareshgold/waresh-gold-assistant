import {
    TelegramActionResolver,
}
from "./TelegramActionResolver";


export interface TelegramActionDefinition {

    id: string;

    command: string;

}



export class TelegramActionCatalog {


    private static readonly actions:

        TelegramActionDefinition[] = [


        { id:"gold.price", command:"/price" },

        { id:"gold.bubble", command:"/bubble" },

        { id:"gold.calculate", command:"/calc" },

        { id:"gold.reverse-labor", command:"/reverse-labor" },


        { id:"market.analytics", command:"/analytics" },

        { id:"market.history", command:"/history" },

        { id:"market.chart", command:"/chart" },


        { id:"calculator.gold-price", command:"/calc" },

        { id:"calculator.invoice", command:"/invoice" },

        { id:"calculator.formula", command:"/formula" },

        { id:"calculator.reverse-labor", command:"/reverse-labor" },


        { id:"assistant.ai", command:"/help" },

        { id:"assistant.learn", command:"/help" },

        { id:"assistant.help", command:"/help" },


        { id:"settings.alerts", command:"/help" },

        { id:"settings.account", command:"/help" },

        { id:"settings.bot", command:"/help" },


    ];





    static getAll():

        TelegramActionDefinition[] {

        return this.actions;

    }





    static find(

        id:string

    ):

        TelegramActionDefinition | undefined {


        return this.actions.find(

            item => item.id === id

        );


    }


}
