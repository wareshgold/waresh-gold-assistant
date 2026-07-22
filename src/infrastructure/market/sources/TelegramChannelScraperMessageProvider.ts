import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class TelegramChannelScraperMessageProvider
implements MarketMessageProvider {



    constructor(
        private readonly channelUrl: string,
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

                    this.channelUrl,

                    {
                        signal:
                            controller.signal
                    }

                );



            if (!response.ok) {

                throw new Error(
                    "Telegram channel unavailable"
                );

            }



            const html =
                await response.text();



            const messages =
                [
                    ...html.matchAll(
                        /tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g
                    )
                ];



            if (
                messages.length === 0
            ) {

                throw new Error(
                    "Telegram message not found"
                );

            }



            const latestMessage =
                messages[
                    messages.length - 1
                ][1]
                    .replace(
                        /<br\s*\/?>/g,
                        "\n"
                    )
                    .replace(
                        /<[^>]+>/g,
                        ""
                    )
                    .trim();



            if (!latestMessage) {

                throw new Error(
                    "Empty telegram message"
                );

            }



            return latestMessage;



        }
        catch(error) {


            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {

                throw new Error(
                    "Telegram channel timeout"
                );

            }


            throw error;


        }
        finally {


            clearTimeout(
                timeout
            );


        }


    }


}