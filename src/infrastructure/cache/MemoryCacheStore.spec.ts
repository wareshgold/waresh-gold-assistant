import { describe, expect, it } from "vitest";
import { MemoryCacheStore } from "./MemoryCacheStore";


describe(
    "MemoryCacheStore",
    ()=>{


    it(
        "should store and retrieve value",
        async()=>{


            const cache =
                new MemoryCacheStore();



            await cache.set(
                "gold-price",
                {
                    value: 18300000
                }
            );



            const result =
                await cache.get<{
                    value:number
                }>(
                    "gold-price"
                );



            expect(result?.value)
                .toBe(18300000);


        }
    );


});