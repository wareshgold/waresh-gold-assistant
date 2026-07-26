import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


import {
  TelegramMenuActionType,
} from "./TelegramMenuAction";



export const TelegramMainMenu: TelegramMenuItem[] = [


  {
    id: "menu.market",

    label: "📊 بازار",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: "menu:market",
    },
  },


  {
    id: "menu.calculate",

    label: "🧮 محاسبات",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: "menu:calculate",
    },
  },


  {
    id: "menu.assistant",

    label: "🤖 دستیار",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: "menu:assistant",
    },
  },


  {
    id: "menu.settings",

    label: "⚙️ تنظیمات",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: "menu:settings",
    },
  },

];