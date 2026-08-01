import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";


import {
    TelegramCommandContext
}
from "../TelegramCommandContext";


import {
    TelegramSessionStore
}
from "../../state/TelegramSessionStore";




export class ReverseGoldCommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly sessionStore:
            TelegramSessionStore

    ) {}





    metadata() {

        return {

            command:
                "/reverse-labor",


            description:
                "محاسبه معکوس اجرت طلا"

        };

    }






    canHandle(

        command:
            string

    ): boolean {


        return command === "/reverse-labor";

    }







    async execute(

        context:
            TelegramCommandContext

    ): Promise<string> {



        const userId =

            context.userId ||

            context.chatId;





        await this.sessionStore.save({

            userId,


            state:

                "REVERSE_LABOR_CALCULATION_WAITING_PRICE",


            data:{},


            updatedAt:

                Date.now()

        });






        return `

🔄 محاسبه معکوس طلا


لطفاً قیمت نهایی فاکتور را وارد کنید:

`.trim();


    }


}