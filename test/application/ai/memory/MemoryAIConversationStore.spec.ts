import {
    describe,
    expect,
    it
}
from "vitest";


import {
    MemoryAIConversationStore
}
from "../../../../src/application/ai/memory/MemoryAIConversationStore";





describe(
    "MemoryAIConversationStore",
    () => {



        it(
            "should store and return conversation history",
            async () => {



                const store =

                    new MemoryAIConversationStore();





                const createdAt =

                    new Date(

                        "2026-08-17T10:00:00.000Z"

                    );





                await store.addMessage(

                    "user-1",

                    {

                        role:

                            "user",

                        content:

                            "قیمت طلا چنده؟",

                        createdAt

                    }

                );





                await store.addMessage(

                    "user-1",

                    {

                        role:

                            "assistant",

                        content:

                            "برای قیمت فعلی از ابزار بازار استفاده می‌کنم.",

                        createdAt:

                            new Date(

                                "2026-08-17T10:00:01.000Z"

                            )

                    }

                );





                const history =

                    await store.getHistory(

                        "user-1"

                    );





                expect(

                    history

                ).toHaveLength(2);





                expect(

                    history[0].role

                ).toBe(

                    "user"

                );





                expect(

                    history[1].role

                ).toBe(

                    "assistant"

                );



            }

        );







        it(
            "should isolate histories between users",
            async () => {



                const store =

                    new MemoryAIConversationStore();





                await store.addMessage(

                    "user-1",

                    {

                        role:

                            "user",

                        content:

                            "message one",

                        createdAt:

                            new Date()

                    }

                );





                await store.addMessage(

                    "user-2",

                    {

                        role:

                            "user",

                        content:

                            "message two",

                        createdAt:

                            new Date()

                    }

                );





                const userOneHistory =

                    await store.getHistory(

                        "user-1"

                    );





                const userTwoHistory =

                    await store.getHistory(

                        "user-2"

                    );





                expect(

                    userOneHistory

                ).toHaveLength(1);





                expect(

                    userOneHistory[0].content

                ).toBe(

                    "message one"

                );





                expect(

                    userTwoHistory

                ).toHaveLength(1);





                expect(

                    userTwoHistory[0].content

                ).toBe(

                    "message two"

                );



            }

        );







        it(
            "should keep only the configured history limit",
            async () => {



                const store =

                    new MemoryAIConversationStore(

                        3

                    );





                for (

                    let index = 1;

                    index <= 5;

                    index++

                ) {



                    await store.addMessage(

                        "user-1",

                        {

                            role:

                                "user",

                            content:

                                `message-${index}`,

                            createdAt:

                                new Date(

                                    2026,

                                    7,

                                    17,

                                    10,

                                    index

                                )

                        }

                    );

                }





                const history =

                    await store.getHistory(

                        "user-1"

                    );





                expect(

                    history.map(

                        message =>

                            message.content

                    )

                ).toEqual([

                    "message-3",

                    "message-4",

                    "message-5"

                ]);



            }

        );







        it(
            "should return a copy of stored messages",
            async () => {



                const store =

                    new MemoryAIConversationStore();





                const originalDate =

                    new Date(

                        "2026-08-17T10:00:00.000Z"

                    );





                await store.addMessage(

                    "user-1",

                    {

                        role:

                            "user",

                        content:

                            "hello",

                        createdAt:

                            originalDate

                    }

                );





                const history =

                    await store.getHistory(

                        "user-1"

                    );





                history[0].content =

                    "modified";





                const secondRead =

                    await store.getHistory(

                        "user-1"

                    );





                expect(

                    secondRead[0].content

                ).toBe(

                    "hello"

                );



            }

        );



    }

);