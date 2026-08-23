import {
    describe,
    expect,
    it,
    vi
}
from "vitest";


import {
    D1AIConversationMemory
}
from "../../../../src/infrastructure/ai/memory/D1AIConversationMemory";





describe(
    "D1AIConversationMemory",
    () => {



        it(
            "should insert conversation messages",
            async () => {



                const run =

                    vi.fn()

                        .mockResolvedValue({

                            success:

                                true

                        });





                const bind =

                    vi.fn()

                        .mockReturnValue({

                            run

                        });





                const prepare =

                    vi.fn()

                        .mockReturnValue({

                            bind

                        });





                const db = {

                    prepare

                } as unknown as D1Database;





                const store =

                    new D1AIConversationMemory(

                        db

                    );





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

                            "سلام",

                        createdAt

                    }

                );





                expect(

                    prepare

                ).toHaveBeenCalledTimes(1);





                expect(

                    bind

                ).toHaveBeenCalledWith(

                    "user-1",

                    "user",

                    "سلام",

                    createdAt.getTime()

                );





                expect(

                    run

                ).toHaveBeenCalledTimes(1);



            }

        );







        it(
            "should return history in chronological order",
            async () => {



                const rows = [

                    {

                        id:

                            2,

                        user_id:

                            "user-1",

                        role:

                            "assistant" as const,

                        content:

                            "پاسخ دوم",

                        created_at:

                            2000

                    },

                    {

                        id:

                            1,

                        user_id:

                            "user-1",

                        role:

                            "user" as const,

                        content:

                            "سوال اول",

                        created_at:

                            1000

                    }

                ];





                const all =

                    vi.fn()

                        .mockResolvedValue({

                            results:

                                rows

                        });





                const bind =

                    vi.fn()

                        .mockReturnValue({

                            all

                        });





                const prepare =

                    vi.fn()

                        .mockReturnValue({

                            bind

                        });





                const db = {

                    prepare

                } as unknown as D1Database;





                const store =

                    new D1AIConversationMemory(

                        db,

                        20

                    );





                const history =

                    await store.getHistory(

                        "user-1"

                    );





                expect(

                    bind

                ).toHaveBeenCalledWith(

                    "user-1",

                    20

                );





                expect(

                    history.map(

                        message =>

                            message.content

                    )

                ).toEqual([

                    "سوال اول",

                    "پاسخ دوم"

                ]);





                expect(

                    history[0].createdAt

                ).toEqual(

                    new Date(1000)

                );



            }

        );







        it(
            "should reject an invalid history limit",
            () => {



                expect(

                    () =>

                        new D1AIConversationMemory(

                            {} as D1Database,

                            0

                        )

                ).toThrow(

                    "AI conversation history limit must be greater than zero"

                );



            }

        );



    }

);