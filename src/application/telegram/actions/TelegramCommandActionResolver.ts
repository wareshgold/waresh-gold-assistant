import {
    TelegramActionResolver,
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
                "gold.reverse-labor",
                "/reverse-labor"
            ],



            [
                "market.analytics",
                "/analytics"
            ],



            [
                "market.history",
                "/history"
            ],



            [
                "market.chart",
                "/chart"
            ],



            [
                "calculator.gold-price",
                "/calc"
            ],



            [
                "calculator.invoice",
                "/invoice"
            ],



            [
                "calculator.formula",
                "/formula"
            ],



            [
                "calculator.reverse-labor",
                "/reverse-labor"
            ],



            [
                "assistant.ai",
                "/help"
            ],



            [
                "assistant.learn",
                "/help"
            ],



            [
                "assistant.help",
                "/help"
            ],



            [
                "settings.alerts",
                "/help"
            ],



            [
                "settings.account",
                "/help"
            ],



            [
                "settings.bot",
                "/help"
            ]



        ]);


    }







    resolve(

        actionId:

            string

    ):
        string | undefined {


        return this.actions.get(

            actionId

        );


    }



}