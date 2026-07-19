import { TelegramCommandExecutor } from "../interfaces/TelegramCommandExecutor";
import { TelegramCommandRouter } from "../commands/TelegramCommandRouter";
import { TelegramCommandContextBuilder } from "../commands/TelegramCommandContextBuilder";
import { GetGoldPriceUseCase } from "../../usecases/GetGoldPriceUseCase";


export class TelegramCommandService
implements TelegramCommandExecutor {


    private readonly contextBuilder:
        TelegramCommandContextBuilder;



    constructor(

        private readonly router:
            TelegramCommandRouter |
            GetGoldPriceUseCase,


        contextBuilder?:
            TelegramCommandContextBuilder

    ) {

        this.contextBuilder =
            contextBuilder ??
            new TelegramCommandContextBuilder();

    }



    async execute(

        command: string

    ): Promise<any> {



        if(
            this.router instanceof TelegramCommandRouter
        ){

            const context =
                this.contextBuilder.build(
                    command
                );


            return this.router.execute(
                context
            );

        }



        if(
            this.router instanceof GetGoldPriceUseCase
        ){

            const result =
                await this.router.execute();



            return {

                content:
                `🟡 وارش گلد\n\nقیمت طلا: ${result.gold18Price}`

            };

        }



        return {

            content:
            "دستور نامعتبر است"

        };

    }


}