import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class TelegramChannelScraperMessageProvider
implements MarketMessageProvider {



    constructor(

        private readonly channelUrl:
            string,


        private readonly timeoutMs:
            number = 5000

    ) {}



    async getLatestMessage():
        Promise<string> {



        const controller =
            new AbortController();



        const timeout =
            setTimeout(

                () => {

                    controller.abort();

                },

                this.timeoutMs

            );



        try {


            console.log(

                "TELEGRAM FETCH START",

                this.channelUrl

            );



            const response =

                await fetch(

                    this.channelUrl,

                    {

                        signal:
                            controller.signal,


                        redirect:
                            "follow",


                        headers: {


                            "User-Agent":
                                "Mozilla/5.0",


                            "Accept":
                                "text/html"

                        }

                    }

                );



            if(!response.ok){


                throw new Error(

                    `Telegram HTTP ${response.status}`

                );

            }



            const html =

                await response.text();



            const messages =

                [

                    ...html.matchAll(

                        /<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g

                    )

                ];



            if(
                messages.length === 0
            ){

                throw new Error(

                    "Telegram message not found"

                );

            }



            let message =

                messages[
                    messages.length - 1
                ][1];



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



            if(!message){


                throw new Error(

                    "Telegram empty message"

                );

            }



            console.log(

                "TELEGRAM MESSAGE RECEIVED"

            );



            return message;



        }
        catch(error){


            if(

                error instanceof DOMException &&

                error.name === "AbortError"

            ){

                throw new Error(

                    "Telegram source timeout"

                );

            }



            throw error;



        }
        finally{


            clearTimeout(

                timeout

            );


        }


    }


}