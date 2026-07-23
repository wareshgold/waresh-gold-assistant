import {
    MarketMessageProvider
}
from "./MarketMessageProvider";


import {
    FakeTelegramChannelMessageProvider
}
from "./FakeTelegramChannelMessageProvider";


import {
    TelegramChannelScraperMessageProvider
}
from "./TelegramChannelScraperMessageProvider";


import {
    AppEnv
}
from "../../../shared/config/env";



export function createTelegramMessageProvider(

    env?:
        AppEnv

): MarketMessageProvider {



    if (

        env?.ENVIRONMENT === "production" &&

        env.TELEGRAM_MARKET_SOURCE_URL

    ) {


        return new TelegramChannelScraperMessageProvider(

            env.TELEGRAM_MARKET_SOURCE_URL

        );


    }



    return new FakeTelegramChannelMessageProvider();


}