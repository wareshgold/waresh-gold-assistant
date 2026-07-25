export interface TelegramUpdate {

    update_id: number;



    message?: {


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