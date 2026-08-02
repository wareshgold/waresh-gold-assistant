import {
    TelegramSessionStore
}
from "./TelegramSessionStore";


import {
    TelegramUserSession
}
from "./TelegramUserSession";




export class D1TelegramSessionStore

implements TelegramSessionStore {



    constructor(

        private readonly db:

            D1Database

    ) {}







    async get<

        TData = Record<string, unknown>,

        TState = string

    >(

        userId: string

    ): Promise<TelegramUserSession<TData, TState> | null> {



        const result =

            await this.db

                .prepare(

                    `
                    SELECT
                        user_id,
                        state,
                        data,
                        updated_at
                    FROM telegram_sessions
                    WHERE user_id = ?
                    `

                )

                .bind(userId)

                .first<{

                    user_id: string;

                    state: string;

                    data: string;

                    updated_at: number;

                }>();






        if (!result) {


            return null;


        }







        return {


            userId:

                result.user_id,



            state:

                result.state as TState,



            data:

                JSON.parse(

                    result.data

                ) as TData,



            updatedAt:

                result.updated_at


        };


    }









    async save<

        TData = Record<string, unknown>,

        TState = string

    >(

        session:

            TelegramUserSession<TData, TState>

    ): Promise<void> {



        await this.db

            .prepare(

                `
                INSERT INTO telegram_sessions
                (
                    user_id,
                    state,
                    data,
                    updated_at
                )
                VALUES
                (?, ?, ?, ?)

                ON CONFLICT(user_id)
                DO UPDATE SET

                    state = excluded.state,

                    data = excluded.data,

                    updated_at = excluded.updated_at
                `

            )

            .bind(


                session.userId,


                session.state,


                JSON.stringify(

                    session.data

                ),


                session.updatedAt


            )

            .run();

    }








    async delete(

        userId: string

    ): Promise<void> {



        await this.db

            .prepare(

                `
                DELETE FROM telegram_sessions
                WHERE user_id = ?
                `

            )

            .bind(userId)

            .run();


    }


}