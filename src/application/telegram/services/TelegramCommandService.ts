import { ApplicationResponse } from "../../common/models/ApplicationResponse";
import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";
import { TelegramCommandExecutor } from "../interfaces/TelegramCommandExecutor";


export class TelegramCommandService implements TelegramCommandExecutor {


    constructor(
        private readonly getGoldPriceUseCase: GetGoldPriceUseCase
    ) {}



    async execute(
        command: string
    ): Promise<ApplicationResponse> {


        const normalizedCommand =
            command.trim().toLowerCase();



        switch (normalizedCommand) {


            case "/start":

                return {
                    type: "text",
                    content:
                        "به وارش گلد خوش آمدید ✨"
                };



            case "/price":

                return await this.getGoldPriceUseCase.execute();



            case "/help":

                return {
                    type: "text",
                    content:
                    [
                        "دستورات موجود:",
                        "/start - شروع ربات",
                        "/price - قیمت لحظه‌ای طلا",
                        "/help - راهنما",
                    ].join("\n")
                };



            default:

                return {
                    type: "text",
                    content:
                        "دستور شناخته نشد. /help را ارسال کنید."
                };

        }

    }

}