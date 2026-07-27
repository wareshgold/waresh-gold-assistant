import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


import {
  TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
  NavigationAction,
} from "../navigation/NavigationAction";



export const TelegramMainMenu: TelegramMenuItem[] = [


  {
    id: "menu.market",

    label: "📊 بازار",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: NavigationAction.MARKET,
    },
  },


  {
    id: "menu.calculate",

    label: "🧮 محاسبات",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: NavigationAction.CALCULATE,
    },
  },


  {
    id: "menu.assistant",

    label: "🤖 دستیار",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: NavigationAction.ASSISTANT,
    },
  },


  {
    id: "menu.settings",

    label: "⚙️ تنظیمات",

    action: {
      type: TelegramMenuActionType.CALLBACK,
      value: NavigationAction.SETTINGS,
    },
  },

];