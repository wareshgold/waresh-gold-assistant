import { describe, expect, it } from "vitest";
import { createCloudflareKVCacheStore } from "./CloudflareKVCacheFactory";
import { CloudflareKVCacheStore } from "./CloudflareKVCacheStore";

describe("CloudflareKVCacheFactory", () => {
  it("should create CloudflareKVCacheStore", () => {
    const fakeKV = {} as KVNamespace;

    const store = createCloudflareKVCacheStore(fakeKV);

    expect(store).toBeInstanceOf(CloudflareKVCacheStore);
  });
});