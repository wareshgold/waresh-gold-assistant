import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



export class HttpTelegramChannelMessageProvider
implements MarketMessageProvider {



    constructor(
        private readonly endpoint: string
    ){}



    async getLatestMessage():
        Promise<string> {


        const response =
            await fetch(
                this.endpoint
            );


        if(!response.ok){

            throw new Error(
                "Telegram source unavailable"
            );

        }



        const data =
            await response.json() as {
                message:string;
            };



        return data.message;


    }


}