import { TelegramCommandExecutor } from "./interfaces/TelegramCommandExecutor";
import { TelegramResponseFormatter } from "./TelegramResponseFormatter";


export class TelegramMessageHandler {


    private readonly formatter:
        TelegramResponseFormatter;



    constructor(
        private readonly commandService: TelegramCommandExecutor
    ) {

        this.formatter =
            new TelegramResponseFormatter();

    }



    async handle(
        message: string
    ): Promise<string> {


        const normalized =
            message.trim()
            .toLowerCase();



        const response =
            await this.commandService.execute(
                normalized === "قیمت طلا" ||
                normalized === "price"
                    ? "/price"
                    : normalized
            );



        return this.formatter.format(
            response
        );

    }

}