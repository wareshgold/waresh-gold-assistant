import {
    CloudflareKVCacheStore,
    KVNamespaceLike
} from "./CloudflareKVCacheStore";


export function createCloudflareKVCache(
    kv: KVNamespaceLike
) {

    return new CloudflareKVCacheStore(
        kv
    );

}