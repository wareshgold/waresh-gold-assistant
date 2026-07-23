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

                        method:
                            "GET",


                        redirect:
                            "follow",


                        signal:
                            controller.signal,


                        headers: {


                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",



                            "Accept":
                                "text/html,application/xhtml+xml"



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

                html.length

            );





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

                "TELEGRAM MESSAGE",

                message

            );





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

        finally {


            clearTimeout(timeout);


        }



    }



}