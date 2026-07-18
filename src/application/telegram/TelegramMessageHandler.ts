import { TelegramCommandService } from "./services/TelegramCommandService";

export class TelegramMessageHandler {

    constructor(
        private readonly commandService: TelegramCommandService
    ) {}

    async handle(
        message: string
    ): Promise<string> {

        const normalized =
            message.trim().toLowerCase();


        if (
            normalized === "قیمت طلا" ||
            normalized === "price"
        ) {

            return this.commandService.execute("/price");

        }


        return this.commandService.execute(normalized);

    }

}