import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class TelegramChannelScraperMessageProvider
implements MarketMessageProvider {



    constructor(
        private readonly channelUrl: string
    ) {}



    async getLatestMessage():
        Promise<string> {



        const startTime =
            Date.now();



        console.log(
            "TELEGRAM FETCH START",
            this.channelUrl
        );



        try {



            const response =
                await fetch(

                    this.channelUrl,

                    {

                        redirect:
                            "follow",


                        headers: {


                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",



                            "Accept":
                                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",



                            "Accept-Language":
                                "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7"


                        }

                    }

                );



            console.log(

                "TELEGRAM RESPONSE RECEIVED",

                response.status,

                Date.now() - startTime

            );



            if (!response.ok) {


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



            const messages =

                [
                    ...html.matchAll(

                        /<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g

                    )

                ];



            if (
                messages.length === 0
            ) {


                throw new Error(

                    "Telegram message html not found"

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

                .replace(
                    /&#x27;/g,
                    "'"
                )

                .trim();



            console.log(

                "TELEGRAM MESSAGE",

                message

            );



            if (!message) {


                throw new Error(

                    "Telegram empty message"

                );


            }



            return message;



        }

        catch(error) {


            console.log(

                "TELEGRAM ERROR",

                error

            );


            throw error;


        }


    }


}