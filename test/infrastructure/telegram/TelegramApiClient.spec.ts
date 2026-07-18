import { describe, expect, it, vi } from "vitest";
import { TelegramApiClient } from "../../../src/infrastructure/telegram/TelegramApiClient";


describe(
    "TelegramApiClient",
    ()=>{


        it(
            "should send telegram message",
            async()=>{


                const fetchMock =
                    vi.fn()
                    .mockResolvedValue({
                        ok:true
                    });


                globalThis.fetch =
                    fetchMock;



                const client =
                    new TelegramApiClient(
                        "TEST_TOKEN"
                    );



                await client.sendMessage(
                    "12345",
                    "Hello Waresh Gold"
                );



                expect(
                    fetchMock
                )
                .toHaveBeenCalledTimes(1);



                expect(
                    fetchMock.mock.calls[0][0]
                )
                .toContain(
                    "TEST_TOKEN"
                );



                expect(
                    fetchMock.mock.calls[0][1]
                )
                .toMatchObject({

                    method:"POST"

                });


            }
        );


    }
);