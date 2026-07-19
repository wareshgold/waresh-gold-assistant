import { TelegramCommandExecutor } from "../interfaces/TelegramCommandExecutor";
import { TelegramCommandRouter } from "../commands/TelegramCommandRouter";
import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export class TelegramCommandService
implements TelegramCommandExecutor {


    constructor(

        private readonly dependency?:
            TelegramCommandRouter | GetGoldPriceUseCase

    ) {}



    async execute(
        command:string
    ):Promise<any>{


        if(this.dependency instanceof TelegramCommandRouter){

            return this.dependency.execute(
                command
            );

        }



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


                if(this.dependency){

                    const result =
                        await this.dependency.execute();



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