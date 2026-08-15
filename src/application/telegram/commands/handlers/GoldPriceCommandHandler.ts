import { TelegramCommandContext }
from "../TelegramCommandContext";

import { TelegramCommandHandler }
from "../TelegramCommandHandler";

import { GetGoldPriceUseCase }
from "../../../usecases/GetGoldPriceUseCase";

import { GoldPriceMessageFormatter }
from "../../presentation/GoldPriceMessageFormatter";



export class GoldPriceCommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly getGoldPriceUseCase:

            GetGoldPriceUseCase,


        private readonly formatter:

            GoldPriceMessageFormatter

    ) {}





    metadata() {

        return {

            command:
                "/price",

            description:
                "قیمت لحظه‌ای طلا"

        };

    }





    canHandle(

        command:
            string

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

        context:
            TelegramCommandContext

    ): Promise<any> {


        try {


            const result =

                await this.getGoldPriceUseCase.execute();




            return {


                content:

                    this.formatter.format(

                        result

                    )


            };


        }

        catch(error) {


            console.error(

                "Gold price command failed:",

                error

            );



            return {


                content:

                    "⚠️ دریافت قیمت طلا در حال حاضر امکان‌پذیر نیست.\nلطفاً چند لحظه بعد دوباره تلاش کنید."

            };


        }


    }


}