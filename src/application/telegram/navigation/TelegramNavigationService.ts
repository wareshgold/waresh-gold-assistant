import {
    TelegramKeyboardMarkup,
} from "../keyboards/TelegramKeyboardMarkup";



export interface TelegramNavigationService {

    mainMenu():

        TelegramKeyboardMarkup;


    backMenu():

        TelegramKeyboardMarkup;

}






export class DefaultTelegramNavigationService

implements TelegramNavigationService {



    mainMenu():

        TelegramKeyboardMarkup {


        return {


            type:

                "INLINE",



            rows: [


                [

                    {

                        text:

                            "💰 قیمت لحظه‌ای",


                        actionId:

                            "gold:price",

                    },


                    {

                        text:

                            "🧮 محاسبه طلا",


                        actionId:

                            "calculate:gold-price",

                    },

                ],




                [

                    {

                        text:

                            "🫧 حباب طلا",


                        actionId:

                            "gold:bubble",

                    },

                ],




                [

                    {

                        text:

                            "❓ راهنما",


                        actionId:

                            "help",

                    },

                ],



            ],


        };


    }







    backMenu():

        TelegramKeyboardMarkup {


        return {


            type:

                "INLINE",



            rows: [


                [

                    {

                        text:

                            "⬅️ بازگشت",


                        actionId:

                            "menu:main",

                    },

                ],


            ],


        };


    }



}