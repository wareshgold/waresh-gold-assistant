export class TelegramMessageHandler {


    async handle(
        message:string
    ):Promise<string>{


        const normalized =
            message.trim()
            .toLowerCase();



        if(
            normalized === "قیمت طلا" ||
            normalized === "price"
        ){

            return "قیمت طلا در حال دریافت است";

        }



        return "دستور نامعتبر است";


    }


}