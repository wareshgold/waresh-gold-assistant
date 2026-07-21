export interface TelegramUpdate {

    update_id: number;


    message: {

        chat?: {

            id: number;

        };


        from?: {

            id: number;

            first_name?: string;

            last_name?: string;

            username?: string;

        };


        text?: string;

    };

}