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

    const rows = [] as TelegramKeyboardMarkup["rows"];

    for (let index = 0; index < items.length; index += 2) {
      const row = [
        this.button(items[index])
      ];

      if (items[index + 1]) {
        row.push(
          this.button(items[index + 1])
        );
      }

      rows.push(row);
    }

    return {
      type: "REPLY",
      rows,
    };
  }


  private button(
    item: TelegramMenuItem
  ) {
    return {
      text: item.label,
      actionId: item.id,
    };
  }
}
