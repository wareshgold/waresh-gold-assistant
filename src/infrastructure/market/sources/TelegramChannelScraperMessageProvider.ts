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



            if(!response.ok){

                throw new Error(
                    `Telegram channel unavailable ${response.status}`
                );

            }



            const html =
                await response.text();



            const startIndex =
                html.lastIndexOf(
                    '<div class="tgme_widget_message_text'
                );



            if(startIndex === -1){

                throw new Error(
                    "Telegram message html not found"
                );

            }



            const endIndex =
                html.indexOf(
                    "</div>",
                    startIndex
                );



            if(endIndex === -1){

                throw new Error(
                    "Telegram message closing tag not found"
                );

            }



            let message =
                html.substring(
                    startIndex,
                    endIndex
                );



            message =
                message
                .replace(
                    /<br\s*\/?>/gi,
                    "\n"
                )
                .replace(
                    /<[^>]+>/g,
                    ""
                )
                .replace(
                    /&nbsp;/g,
                    " "
                )
                .trim();



            if(!message){

                throw new Error(
                    "Telegram empty message"
                );

            }



            return message;



        }
        catch(error){



            if(
                error instanceof DOMException &&
                error.name === "AbortError"
            ){

                throw new Error(
                    "Telegram channel timeout"
                );

            }



            throw error;



        }
        finally{

            clearTimeout(timeout);

        }



    }


}