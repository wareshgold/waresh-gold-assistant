import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class TelegramChannelScraperMessageProvider
implements MarketMessageProvider {



    constructor(
        private readonly channelUrl: string,
        private readonly timeoutMs: number = 15000
    ) {}



    async getLatestMessage():
        Promise<string> {



        const startTime =
            Date.now();



        console.log(
            "TELEGRAM FETCH START",
            this.channelUrl
        );



        const controller =
            new AbortController();



        const timeout =
            setTimeout(
                () => {

                    console.log(
                        "TELEGRAM ABORT TRIGGERED",
                        Date.now() - startTime
                    );

                    controller.abort();

                },
                this.timeoutMs
            );



        try {



            const response =
                await fetch(

                    this.channelUrl,

                    {
                        signal:
                            controller.signal,

                        headers: {

                            "User-Agent":
                                "Mozilla/5.0",

                            "Accept":
                                "text/html"

                        }

                    }

                );



            console.log(
                "TELEGRAM RESPONSE RECEIVED",
                response.status,
                Date.now() - startTime
            );



            if(!response.ok){

                throw new Error(
                    `Telegram channel unavailable ${response.status}`
                );

            }



            const html =
                await response.text();



            console.log(
                "TELEGRAM HTML LENGTH",
                html.length,
                Date.now() - startTime
            );



            const startIndex =
                html.lastIndexOf(
                    '<div class="tgme_widget_message_text'
                );



            console.log(
                "TELEGRAM START INDEX",
                startIndex
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
                .replace(
                    /&amp;/g,
                    "&"
                )
                .trim();



            console.log(
                "TELEGRAM MESSAGE",
                message
            );



            if(!message){

                throw new Error(
                    "Telegram empty message"
                );

            }



            return message;



        }
        catch(error){



            console.log(
                "TELEGRAM ERROR",
                error
            );



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