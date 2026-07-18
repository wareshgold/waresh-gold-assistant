import { TelegramCommandExecutor } from "./interfaces/TelegramCommandExecutor";


export class TelegramMessageHandler {


    constructor(
        private readonly commandService: TelegramCommandExecutor
    ) {}


    async handle(
        message: string
    ): Promise<string> {


        const normalized =
            message.trim()
            .toLowerCase();



        if (
            normalized === "قیمت طلا" ||
            normalized === "price"
        ) {

            return this.commandService.execute(
                "/price"
            );

        }



        return this.commandService.execute(
            normalized
        );

    }


}