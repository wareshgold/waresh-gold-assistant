export interface TelegramUpdate {

    update_id: number;



    message?: {


        chat?: {

            id: number;

            username?: string;

            title?: string;

            type?: string;

        };



        from?: {

            id: number;

            first_name?: string;

            last_name?: string;

            username?: string;

        };



        date?: number;



        text?: string;


    };



    channel_post?: {


        chat?: {

            id: number;

            username?: string;

            title?: string;

            type?: string;

        };



        date?: number;



        text?: string;


    };



    callback_query?: {


        id: string;



        data?: string;



        from?: {


            id: number;

            first_name?: string;

            last_name?: string;

            username?: string;


        };



        message?: {


            chat?: {


                id: number;


            };

            message_id?: number;


        };


    };


}