import {
    MarketMessageProvider
}
from "./MarketMessageProvider";


import {
    TelegramPriceParser
}
from "../parsers/TelegramPriceParser";



export class TelegramChannelScraperMessageProvider
implements MarketMessageProvider {



    constructor(

        private readonly channelUrl:
            string,


        private readonly timeoutMs:
            number = 15000

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
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",


                            "Accept":
                                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",


                            "Accept-Language":
                                "fa-IR,fa;q=0.9,en;q=0.8"

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



            for(
                let i = messages.length - 1;
                i >= 0;
                i--
            ){



                const message =

                    this.cleanHtmlMessage(

                        messages[i][1]

                    );



                if(!message){

                    continue;

                }



                try {


                    TelegramPriceParser.parse(

                        message

                    );



                    console.log(

                        "VALID TELEGRAM PRICE MESSAGE FOUND"

                    );



                    return message;



                }
                catch{


                    continue;

                }


            }



            throw new Error(

                "No valid telegram price message found"

            );



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





    private cleanHtmlMessage(
        html: string
    ): string {


        return html

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

    }


}