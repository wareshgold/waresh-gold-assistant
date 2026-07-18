import { describe, expect, it } from "vitest";
import { CloudflareKVCacheStore } from "./CloudflareKVCacheStore";


class FakeKV {


    private data =
        new Map<string,string>();


    async get(
        key:string,
        type?: "json"
    ){

        const value =
            this.data.get(key);


        if(!value)
            return null;


        return JSON.parse(value);

    }



    async put(
        key:string,
        value:string
    ){

        this.data.set(
            key,
            value
        );

    }



    async delete(
        key:string
    ){

        this.data.delete(key);

    }

}



describe(
    "CloudflareKVCacheStore",
    ()=>{


    it(
        "should store and retrieve data",
        async()=>{


            const cache =
                new CloudflareKVCacheStore(
                    new FakeKV()
                );



            await cache.set(
                "price",
                {
                    gold18Price:18300000
                }
            );



            const result =
                await cache.get<{
                    gold18Price:number
                }>(
                    "price"
                );



            expect(
                result?.gold18Price
            )
            .toBe(18300000);


        }
    );


});