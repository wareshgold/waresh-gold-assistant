import { TelegramUserProfileStore }
from "./TelegramUserProfileStore";


import { TelegramUserProfile }
from "./TelegramUserProfile";



export class D1TelegramUserProfileStore

implements TelegramUserProfileStore {


    constructor(

        private readonly db:
            D1Database

    ) {}



    async get(

        userId: string

    ): Promise<TelegramUserProfile | null> {


        const result =

            await this.db

                .prepare(

                    `
                    SELECT
                        user_id,
                        username,
                        first_name,
                        last_seen_at,
                        created_at
                    FROM telegram_user_profiles
                    WHERE user_id = ?
                    `

                )

                .bind(userId)

                .first<{

                    user_id: string;

                    username?: string;

                    first_name?: string;

                    created_at: number;

                    last_seen_at: number;

                }>();



        if (!result) {

            return null;

        }



        return {


            userId:

                result.user_id,


            username:

                result.username,


            firstName:

                result.first_name,


            createdAt:

                result.created_at,


            lastSeenAt:

                result.last_seen_at


        };


    }



    async save(

        profile: TelegramUserProfile

    ): Promise<void> {


        await this.db

            .prepare(

                `
                INSERT INTO telegram_user_profiles
                (
                    user_id,
                    username,
                    first_name,
                    created_at,
                    last_seen_at
                )

                VALUES
                (?, ?, ?, ?, ?)

                ON CONFLICT(user_id)

                DO UPDATE SET

                    username = excluded.username,

                    first_name = excluded.first_name,

                    last_seen_at = excluded.last_seen_at
                `

            )

            .bind(

                profile.userId,

                profile.username ?? null,

                profile.firstName ?? null,

                profile.createdAt,

                profile.lastSeenAt

            )

            .run();


    }


}