import { describe, expect, it, vi } from "vitest";
import { HttpPriceSourceClient } from "./HttpPriceSourceClient";


describe("HttpPriceSourceClient", () => {


    it("should fetch market price from api", async () => {


        global.fetch = vi.fn()
            .mockResolvedValue({


                ok: true,


                json: async () => ({

                    gold18Price: 18306478,

                    currencyPrice: 187790,

                    ouncePrice: 3350,

                    updatedAt: new Date().toISOString()

                })


            } as Response);



        const client =
            new HttpPriceSourceClient(
                "https://fake-price-api.com"
            );



        const result =
            await client.fetchPrice();



        expect(result.gold18Price)
            .toBe(18306478);



        expect(result.currencyPrice)
            .toBe(187790);



        expect(result.ouncePrice)
            .toBe(3350);



    });





    it("should throw error when api fails", async () => {



        global.fetch = vi.fn()
            .mockResolvedValue({


                ok: false


            } as Response);




        const client =
            new HttpPriceSourceClient(
                "https://fake-price-api.com"
            );




        await expect(

            client.fetchPrice()

        )
        .rejects
        .toThrow(

            "Failed to fetch market price"

        );


    });



});