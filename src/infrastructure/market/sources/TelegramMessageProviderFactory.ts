import {
    MarketMessageProvider
}
from "./MarketMessageProvider";


import {
    FakeTelegramChannelMessageProvider
}
from "./FakeTelegramChannelMessageProvider";


import {
    HttpTelegramChannelMessageProvider
}
from "./HttpTelegramChannelMessageProvider";


import {
    AppEnv
}
from "../../../shared/config/env";





export function createTelegramMessageProvider(
    env?: AppEnv
): MarketMessageProvider {



    if (

        env &&

        env.ENVIRONMENT === "production" &&

        env.TELEGRAM_MARKET_SOURCE_URL

    ) {


        return new HttpTelegramChannelMessageProvider(

            env.TELEGRAM_MARKET_SOURCE_URL

        );


    }





    return new FakeTelegramChannelMessageProvider();



}