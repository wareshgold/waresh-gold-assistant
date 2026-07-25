import {
    TelegramKeyboardMarkup
}
from "../../application/telegram/keyboards/TelegramKeyboardMarkup";




export interface TelegramReplyMarkup {


    keyboard: {


        text: string;


    }[][];



    resize_keyboard: boolean;


}





export interface TelegramInlineMarkup {


    inline_keyboard: {


        text: string;


        callback_data: string;


    }[][];


}







export class TelegramKeyboardMapper {




    map(


        markup:
            TelegramKeyboardMarkup


    ):

        TelegramReplyMarkup
        |
        TelegramInlineMarkup
        |
        undefined {





        if (

            markup.type === "REPLY"

        ) {


            return {


                keyboard:

                    markup.rows.map(

                        row =>

                            row.map(

                                button => ({


                                    text:

                                        button.text


                                })


                            )


                    ),



                resize_keyboard:

                    true


            };


        }







        if (

            markup.type === "INLINE"

        ) {


            return {


                inline_keyboard:

                    markup.rows.map(

                        row =>

                            row.map(

                                button => ({



                                    text:

                                        button.text,



                                    callback_data:

                                        button.actionId ?? ""


                                })


                            )


                    )


            };


        }







        return undefined;


    }



}