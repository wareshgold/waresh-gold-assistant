import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { GetGoldPriceUseCase } from "../../../usecases/GetGoldPriceUseCase";


export class GetGoldPriceCommandHandler
implements TelegramCommandHandler {


    constructor(
        private readonly getGoldPriceUseCase: GetGoldPriceUseCase
    ) {}



    canHandle(
        command: string
    ): boolean {

        return (
            command === "/price" ||
            command === "قیمت طلا" ||
            command === "قیمت"
        );

    }



    async execute(): Promise<any> {


        const result =
            await this.getGoldPriceUseCase.execute();



        return result;

    }

}