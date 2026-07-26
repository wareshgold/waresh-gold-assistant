import {
    TelegramKeyboardMarkup,
} from "./TelegramKeyboardMarkup";


export class TelegramNavigationKeyboardFactory {


    createBackToMain():

        TelegramKeyboardMarkup {


        return {

            type: "INLINE",

            rows: [

                [
                    {
                        text: "⬅️ بازگشت",
                        actionId: "menu:main",
                    }
                ]

            ]

        };

    }


}