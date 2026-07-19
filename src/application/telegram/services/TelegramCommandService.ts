import { TelegramCommandExecutor } from "../interfaces/TelegramCommandExecutor";
import { TelegramCommandRouter } from "../commands/TelegramCommandRouter";
import { TelegramCommandContext } from "../commands/TelegramCommandContext";
import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export class TelegramCommandService
implements TelegramCommandExecutor {


    constructor(

        private readonly dependency?:
        TelegramCommandRouter | GetGoldPriceUseCase

    ) {}



    async execute(
        input: string | TelegramCommandContext
    ): Promise<any> {



        if (

            this.dependency &&
            this.dependency instanceof TelegramCommandRouter

        ) {


            const context =
                typeof input === "string"

                    ? this.createContext(input)

                    : input;



            return this.dependency.execute(
                context
            );

        }



        return this.executeLegacy(
            typeof input === "string"
                ? input
                : input.command
        );


    }



    private createContext(
        command: string
    ): TelegramCommandContext {


        const parts =
            command.trim().split(" ");



        return {

            chatId: "",

            command: parts[0],

            arguments: parts.slice(1)

        };


    }



    private async executeLegacy(
        command: string
    ): Promise<any> {


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


                if (
                    this.dependency
                    instanceof GetGoldPriceUseCase
                ) {


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