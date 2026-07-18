import { CacheStore } from "./CacheStore";


export interface KVNamespaceLike {

    get(
        key: string,
        type?: "json"
    ): Promise<any | null>;


    put(
        key: string,
        value: string,
        options?: {
            expirationTtl?: number;
        }
    ): Promise<void>;


    delete(
        key: string
    ): Promise<void>;

}



export class CloudflareKVCacheStore
implements CacheStore {


    constructor(
        private readonly kv: KVNamespaceLike
    ) {}



    async get<T>(
        key: string
    ): Promise<T | null> {


        return await this.kv.get(
            key,
            "json"
        );

    }



    async set<T>(
        key: string,
        value: T,
        ttlSeconds?: number
    ): Promise<void> {


        await this.kv.put(
            key,
            JSON.stringify(value),
            {
                expirationTtl: ttlSeconds
            }
        );

    }



    async delete(
        key: string
    ): Promise<void> {


        await this.kv.delete(
            key
        );

    }

}