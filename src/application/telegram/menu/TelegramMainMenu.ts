import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


import {
  TelegramMenuActionType,
} from "./TelegramMenuAction";


export const TelegramMainMenu: TelegramMenuItem[] = [

  {
    id: "gold.price",

    label: "💰 قیمت طلا",

    action: {
      type: TelegramMenuActionType.COMMAND,
      value: "price",
    },
  },


  {
    id: "gold.bubble",

    label: "🫧 حباب طلا",

    action: {
      type: TelegramMenuActionType.COMMAND,
      value: "bubble",
    },
  },


  {
    id: "gold.calculate",

    label: "🧮 محاسبه طلا",

    action: {
      type: TelegramMenuActionType.COMMAND,
      value: "calc",
    },
  },


  {
    id: "market.analytics",

    label: "📈 تحلیل بازار",

    action: {
      type: TelegramMenuActionType.COMMAND,
      value: "analytics",
    },
  },


  {
    id: "market.history",

    label: "📜 تاریخچه قیمت",

    action: {
      type: TelegramMenuActionType.COMMAND,
      value: "history",
    },
  },
];