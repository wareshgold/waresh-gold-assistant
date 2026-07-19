import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { GetGoldPriceUseCase } from "../../../usecases/GetGoldPriceUseCase";


export class GoldPriceCommandHandler
implements TelegramCommandHandler {


    constructor(

        private readonly getGoldPriceUseCase:
            GetGoldPriceUseCase

    ) {}



    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim();



        return (

            normalizedCommand === "/price" ||
            normalizedCommand === "قیمت" ||
            normalizedCommand === "قیمت طلا"

        );

    }



    async execute(

        context: TelegramCommandContext

    ): Promise<any> {


        const result =
            await this.getGoldPriceUseCase.execute();



        return {

            content:
                "🟡 قیمت طلا\n\n" +
                `قیمت: ${result.gold18Price}\n` +
                `واحد: ${result.currency ?? "IRR"}\n` +
                `زمان: ${result.timestamp ?? new Date().toISOString()}`

        };


    }


}