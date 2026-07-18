import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";
import { TelegramCommandExecutor } from "../interfaces/TelegramCommandExecutor";


export class TelegramCommandService implements TelegramCommandExecutor {


    constructor(
        private readonly getGoldPriceUseCase: GetGoldPriceUseCase
    ) {}


    async execute(
        command: string
    ): Promise<string> {


        const normalizedCommand =
            command.trim().toLowerCase();



        switch (normalizedCommand) {


            case "/start":

                return "به وارش گلد خوش آمدید ✨";



            case "/price": {

                const response =
                    await this.getGoldPriceUseCase.execute();


                return response.content;

            }



            case "/help":

                return [
                    "دستورات موجود:",
                    "/start - شروع ربات",
                    "/price - قیمت لحظه‌ای طلا",
                    "/help - راهنما",
                ].join("\n");



            default:

                return "دستور شناخته نشد. /help را ارسال کنید.";

        }

    }

}