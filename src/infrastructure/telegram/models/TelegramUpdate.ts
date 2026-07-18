export interface TelegramUpdate {

    update_id: number;

    message: {

        chat?: {

            id: number;

        };

        from?: {

            id: number;

        };

        text?: string;

    };

}