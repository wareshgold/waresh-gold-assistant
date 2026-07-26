import {
    TelegramKeyboardMarkup,
} from "../keyboards/TelegramKeyboardMarkup";



export class TelegramNavigationKeyboardFactory {




    marketResult():

        TelegramKeyboardMarkup {


        return {


            type:

                "INLINE",



            rows: [


                [

                    {

                        text:

                            "📊 بازگشت به بازار",


                        actionId:

                            "menu:market",

                    }

                ],



                [

                    {

                        text:

                            "🏠 منوی اصلی",


                        actionId:

                            "menu:main",

                    }

                ]


            ]


        };

    }







    calculatorResult():

        TelegramKeyboardMarkup {


        return {


            type:

                "INLINE",



            rows: [


                [

                    {

                        text:

                            "🧮 محاسبه جدید",


                        actionId:

                            "menu:calculate",

                    }

                ],



                [

                    {

                        text:

                            "🏠 منوی اصلی",


                        actionId:

                            "menu:main",

                    }

                ]


            ]


        };

    }







    assistantResult():

        TelegramKeyboardMarkup {


        return {


            type:

                "INLINE",



            rows: [


                [

                    {

                        text:

                            "🤖 بازگشت به دستیار",


                        actionId:

                            "menu:assistant",

                    }

                ],



                [

                    {

                        text:

                            "🏠 منوی اصلی",


                        actionId:

                            "menu:main",

                    }

                ]


            ]


        };

    }



}