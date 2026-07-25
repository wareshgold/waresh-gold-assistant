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





export class TelegramKeyboardMapper {



    map(

        markup:
            TelegramKeyboardMarkup

    ): TelegramReplyMarkup | undefined {



        if (

            markup.type !== "REPLY"

        ) {


            return undefined;


        }






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



}