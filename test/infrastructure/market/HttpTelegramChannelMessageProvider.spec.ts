import { describe, expect, it, vi } from "vitest";

import { HttpTelegramChannelMessageProvider }
from "../../../src/infrastructure/market/sources/HttpTelegramChannelMessageProvider";



describe(
    "HttpTelegramChannelMessageProvider",
    () => {



        it(
            "should return telegram message from endpoint",
            async () => {


                global.fetch =
                    vi.fn()
                    .mockResolvedValue({

                        ok:true,


                        json: async () => ({

                            message:
                                "طلای ۱۸ عیار: 18000000"

                        })

                    }) as any;



                const provider =
                    new HttpTelegramChannelMessageProvider(
                        "https://example.com"
                    );



                const result =
                    await provider.getLatestMessage();



                expect(result)
                    .toBe(
                        "طلای ۱۸ عیار: 18000000"
                    );


            }
        );




        it(
            "should throw when endpoint fails",
            async () => {


                global.fetch =
                    vi.fn()
                    .mockResolvedValue({

                        ok:false

                    }) as any;



                const provider =
                    new HttpTelegramChannelMessageProvider(
                        "https://example.com"
                    );



                await expect(

                    provider.getLatestMessage()

                )
                .rejects
                .toThrow(
                    "Telegram source unavailable"
                );


            }
        );



    }
);