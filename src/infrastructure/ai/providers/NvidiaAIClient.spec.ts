import {
    describe,
    expect,
    it,
    vi
}
from "vitest";


import {
    NvidiaAIClient
}
from "./NvidiaAIClient";


import {
    AIMessage
}
from "../../../application/ai/client/AIMessage";



describe(

    "NvidiaAIClient",

    () => {



        it(

            "should send a valid chat completion request",

            async () => {



                const mockResponse = {

                    ok:

                        true,


                    json:

                        async () => ({

                            choices:

                            [

                                {

                                    message:

                                    {

                                        content:

                                            "قیمت طلا امروز 10 میلیون تومان است."

                                    }

                                }

                            ],


                            model:

                                "meta/llama-3.1-8b-instruct",


                            usage:

                            {

                                prompt_tokens:

                                    20,


                                completion_tokens:

                                    10

                            }

                        })

                };





                const fetchMock =

                    vi.fn()

                        .mockResolvedValue(

                            mockResponse

                        );





                vi.stubGlobal(

                    "fetch",

                    fetchMock

                );





                const client =

                    new NvidiaAIClient(

                        "test-api-key",

                        "https://example.com/v1/chat/completions"

                    );





                const messages:

                    AIMessage[] =

                [

                    {

                        role:

                            "system",

                        content:

                            "You are Waresh Gold AI assistant."

                    },


                    {

                        role:

                            "user",

                        content:

                            "قیمت طلا چنده؟"

                    }

                ];





                const result =

                    await client.complete(

                        messages

                    );





                expect(

                    fetchMock

                )

                    .toHaveBeenCalledTimes(

                        1

                    );





                expect(

                    fetchMock

                )

                    .toHaveBeenCalledWith(

                        "https://example.com/v1/chat/completions",

                        expect.objectContaining({

                            method:

                                "POST",


                            headers:

                                expect.objectContaining({

                                    "Content-Type":

                                        "application/json",


                                    Accept:

                                        "application/json",


                                    Authorization:

                                        "Bearer test-api-key"

                                })

                        })

                    );





                const requestOptions =

                    fetchMock.mock.calls[0][1];





                expect(

                    requestOptions

                )

                    .toBeDefined();





                expect(

                    JSON.parse(

                        String(

                            requestOptions.body

                        )

                    )

                )

                    .toEqual({

                        model:

                            "meta/llama-3.1-8b-instruct",


                        messages

                    });





                expect(

                    result

                )

                    .toEqual({

                        content:

                            "قیمت طلا امروز 10 میلیون تومان است.",


                        model:

                            "meta/llama-3.1-8b-instruct",


                        usage:

                        {

                            inputTokens:

                                20,


                            outputTokens:

                                10

                        }

                    });


            }

        );





        it(

            "should include tool definitions when provided",

            async () => {



                const mockResponse = {

                    ok:

                        true,


                    json:

                        async () => ({

                            choices:

                            [

                                {

                                    message:

                                    {

                                        content:

                                            ""

                                    }

                                }

                            ]

                        })

                };





                const fetchMock =

                    vi.fn()

                        .mockResolvedValue(

                            mockResponse

                        );





                vi.stubGlobal(

                    "fetch",

                    fetchMock

                );





                const client =

                    new NvidiaAIClient(

                        "test-api-key",

                        "https://example.com/v1/chat/completions"

                    );





                const messages:

                    AIMessage[] =

                [

                    {

                        role:

                            "user",

                        content:

                            "قیمت طلا؟"

                    }

                ];





                await client.complete(

                    messages,

                    {

                        tools:

                        [

                            {

                                name:

                                    "get_current_gold_price",


                                description:

                                    "Get current gold price",


                                parameters:

                                {

                                    type:

                                        "object"

                                }

                            }

                        ]

                    }

                );





                const requestOptions =

                    fetchMock.mock.calls[0][1];





                const body =

                    JSON.parse(

                        String(

                            requestOptions.body

                        )

                    );





                expect(

                    body.model

                )

                    .toBe(

                        "meta/llama-3.1-8b-instruct"

                    );





                expect(

                    body.messages

                )

                    .toEqual(

                        messages

                    );





                expect(

                    body.tools

                )

                    .toEqual([

                        {

                            type:

                                "function",


                            function:

                            {

                                name:

                                    "get_current_gold_price",


                                description:

                                    "Get current gold price",


                                parameters:

                                {

                                    type:

                                        "object"

                                }

                            }

                        }

                    ]);


            }

        );





        it(

            "should map NVIDIA response to AICompletionResult",

            async () => {



                const fetchMock =

                    vi.fn()

                        .mockResolvedValue({

                            ok:

                                true,


                            json:

                                async () => ({

                                    choices:

                                    [

                                        {

                                            message:

                                            {

                                                content:

                                                    "پاسخ تستی"

                                            }

                                        }

                                    ],


                                    model:

                                        "test-model",


                                    usage:

                                    {

                                        prompt_tokens:

                                            15,


                                        completion_tokens:

                                            7

                                    }

                                })

                        });





                vi.stubGlobal(

                    "fetch",

                    fetchMock

                );





                const client =

                    new NvidiaAIClient(

                        "test-api-key",

                        "https://example.com/v1/chat/completions"

                    );





                const result =

                    await client.complete(

                        [

                            {

                                role:

                                    "user",

                                content:

                                    "سلام"

                            }

                        ]

                    );





                expect(

                    result.content

                )

                    .toBe(

                        "پاسخ تستی"

                    );





                expect(

                    result.model

                )

                    .toBe(

                        "test-model"

                    );





                expect(

                    result.usage

                )

                    .toEqual({

                        inputTokens:

                            15,


                        outputTokens:

                            7

                    });


            }

        );





        it(

            "should throw when NVIDIA request fails",

            async () => {



                const fetchMock =

                    vi.fn()

                        .mockResolvedValue({

                            ok:

                                false,


                            status:

                                401

                        });





                vi.stubGlobal(

                    "fetch",

                    fetchMock

                );





                const client =

                    new NvidiaAIClient(

                        "invalid-api-key",

                        "https://example.com/v1/chat/completions"

                    );





                await expect(

                    client.complete(

                        [

                            {

                                role:

                                    "user",

                                content:

                                    "سلام"

                            }

                        ]

                    )

                )

                    .rejects

                    .toThrow(

                        "NVIDIA AI request failed: 401"

                    );


            }

        );


    }

);