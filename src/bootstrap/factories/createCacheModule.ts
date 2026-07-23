import { createCloudflareKVCacheStore }
from "../../infrastructure/cache/CloudflareKVCacheFactory";

import { AppEnv }
from "../../shared/config/env";


export function createCacheModule(
    env: AppEnv
) {


    const cache =

        createCloudflareKVCacheStore(

            env.MARKET_CACHE

        );


    return {


        cache


    };


}