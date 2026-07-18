import { createCloudflareKVCacheStore } from "../infrastructure/cache/CloudflareKVCacheFactory";

export function createContainer(env: Env) {
  return {
    cache: createCloudflareKVCacheStore(env.MARKET_CACHE),
  };
}