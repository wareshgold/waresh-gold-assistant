import { describe, expect, it, vi } from "vitest";

import { HttpTelegramChannelMessageProvider }
from "../../../src/infrastructure/market/sources/HttpTelegramChannelMessageProvider";



describe(
    "HttpTelegramChannelMessageProvider",
    () => {



        it(
            "should return telegram message from http source",
            async () => {



                global.fetch =
                    vi.fn()
                    .mockResolvedValue({

                        ok: true,


                        json:
                            async () => ({

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
            "should throw error when source response is invalid",
            async () => {



                global.fetch =
                    vi.fn()
                    .mockResolvedValue({

                        ok: true,


                        json:
                            async () => ({})

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
                    "Invalid telegram source response"
                );


            }
        );






        it(
            "should throw error when source is unavailable",
            async () => {



                global.fetch =
                    vi.fn()
                    .mockResolvedValue({

                        ok: false

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






        it(
            "should throw timeout error when request exceeds timeout",
            async () => {



                global.fetch =
                    vi.fn()
                    .mockImplementation(
                        (
                            _url,
                            options
                        ) => {


                            return new Promise(
                                (_resolve, reject) => {


                                    options.signal.addEventListener(
                                        "abort",
                                        () => {


                                            reject(
                                                new DOMException(
                                                    "Aborted",
                                                    "AbortError"
                                                )
                                            );


                                        }
                                    );


                                }
                            );


                        }
                    ) as any;



                const provider =
                    new HttpTelegramChannelMessageProvider(
                        "https://example.com",
                        10
                    );



                await expect(
                    provider.getLatestMessage()
                )
                .rejects
                .toThrow(
                    "Telegram source timeout"
                );


            }
        );




    }
);