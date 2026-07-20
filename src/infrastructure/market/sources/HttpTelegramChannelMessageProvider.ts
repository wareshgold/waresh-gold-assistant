import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class HttpTelegramChannelMessageProvider
implements MarketMessageProvider {



    constructor(
        private readonly endpoint: string,
        private readonly timeoutMs: number = 5000
    ) {}



    async getLatestMessage():
        Promise<string> {



        const controller =
            new AbortController();



        const timeout =
            setTimeout(
                () => controller.abort(),
                this.timeoutMs
            );



        try {


            const response =
                await fetch(

                    this.endpoint,

                    {
                        signal:
                            controller.signal
                    }

                );



            if (!response.ok) {

                throw new Error(
                    "Telegram source unavailable"
                );

            }



            const data =
                await response.json() as {
                    message?: string;
                };



            if (
                !data.message ||
                typeof data.message !== "string"
            ) {

                throw new Error(
                    "Invalid telegram source response"
                );

            }



            return data.message;



        } catch(error) {


            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {

                throw new Error(
                    "Telegram source timeout"
                );

            }



            throw error;



        } finally {


            clearTimeout(
                timeout
            );


        }


    }


}