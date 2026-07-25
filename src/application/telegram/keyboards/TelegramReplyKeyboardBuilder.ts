import {
  TelegramMenuItem,
} from "../menu/TelegramMenuItem";


import {
  TelegramKeyboardMarkup,
} from "./TelegramKeyboardMarkup";


export class TelegramReplyKeyboardBuilder {


  build(
    items: TelegramMenuItem[]
  ): TelegramKeyboardMarkup {


    return {

      type: "REPLY",

      rows: items.map(
        item => [
          {
            text: item.label,

            actionId: item.id,
          },
        ],
      ),
    };
  }
}