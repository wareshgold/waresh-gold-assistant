import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export interface TelegramCommandExecutor {

    execute(
        command:string
    ):Promise<any>;

}



export class TelegramCommandService
implements TelegramCommandExecutor {


    constructor(
        private readonly getGoldPriceUseCase?: GetGoldPriceUseCase
    ){}



    async execute(
        command:string
    ){


        const normalizedCommand =
            command.trim();



        switch(normalizedCommand){


            case "/start":

                return {

                    content:
                    "سلام به وارش گلد خوش آمدید"

                };



            case "/help":

                return {

                    content:
                    "دستورات:\n/price"

                };



            case "/price":

            case "قیمت طلا":

            case "قیمت":

                if(this.getGoldPriceUseCase){

                    const result =
                        await this.getGoldPriceUseCase.execute();


                    return {

                        content:
                        `قیمت طلا: ${result.gold18Price}`

                    };

                }


                return {

                    content:
                    "قیمت طلا در حال دریافت است..."

                };



            default:


                return {

                    content:
                    "دستور نامعتبر است"

                };


        }


    }


}