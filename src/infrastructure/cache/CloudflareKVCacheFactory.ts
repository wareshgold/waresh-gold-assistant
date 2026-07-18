import { CloudflareKVCacheStore } from "./CloudflareKVCacheStore";

export function createCloudflareKVCacheStore(
  kv: KVNamespace
): CloudflareKVCacheStore {
  return new CloudflareKVCacheStore(kv);
}