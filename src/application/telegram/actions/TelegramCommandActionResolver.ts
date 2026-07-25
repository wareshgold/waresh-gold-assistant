import {
    TelegramActionResolver
}
from "./TelegramActionResolver";



export class TelegramCommandActionResolver
implements TelegramActionResolver {



    private readonly actions:

        Map<string, string>;





    constructor() {


        this.actions = new Map([


            [
                "gold.price",
                "/price"
            ],


            [
                "gold.bubble",
                "/bubble"
            ],


            [
                "gold.calculate",
                "/calc"
            ],


            [
                "market.analytics",
                "/analytics"
            ],


            [
                "market.history",
                "/history"
            ]



        ]);


    }





    resolve(

        actionId: string

    ): string | undefined {


        return this.actions.get(

            actionId

        );


    }



}