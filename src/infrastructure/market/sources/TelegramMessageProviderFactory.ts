import {
    MarketMessageProvider
}
from "./MarketMessageProvider";


import {
    FakeTelegramChannelMessageProvider
}
from "./FakeTelegramChannelMessageProvider";



export function createTelegramMessageProvider(

    _env?:
        import("../../../shared/config/env").AppEnv

): MarketMessageProvider {


    return new FakeTelegramChannelMessageProvider();


}