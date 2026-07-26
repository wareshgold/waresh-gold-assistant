import {
    TelegramActionResolver
}
from "./TelegramActionResolver";



export class TelegramTextActionResolver

implements TelegramActionResolver {



    private readonly actions:

        Map<string, string>;




    constructor() {


        this.actions = new Map([


            [
                "price",
                "/price"
            ],


            [
                "bubble",
                "/bubble"
            ],


            [
                "calc",
                "/calc"
            ],


            [
                "analytics",
                "/analytics"
            ],


            [
                "history",
                "/history"
            ]


        ]);


    }





    resolve(

        actionId:
            string

    ): string | undefined {


        return this.actions.get(

            actionId

        );


    }


}