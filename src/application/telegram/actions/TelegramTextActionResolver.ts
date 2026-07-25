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
                "💰 قیمت طلا",
                "gold.price"
            ],


            [
                "🫧 حباب طلا",
                "gold.bubble"
            ],


            [
                "🧮 محاسبه طلا",
                "gold.calculate"
            ],


            [
                "📈 تحلیل بازار",
                "market.analytics"
            ],


            [
                "📜 تاریخچه قیمت",
                "market.history"
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