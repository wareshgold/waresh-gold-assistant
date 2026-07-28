import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    NavigationAction,
} from "../navigation/NavigationAction";



export class TelegramMenuCallbackResolver {



    resolve(

        item: TelegramMenuItem

    ): string {



        switch (item.id) {



            case "gold.price":

                return NavigationAction.GOLD_PRICE;



            case "gold.bubble":

                return NavigationAction.GOLD_BUBBLE;



            case "calculate.gold-price":

                return NavigationAction.CALCULATE_GOLD_PRICE;



            case "market.analytics":

                return NavigationAction.MARKET_ANALYTICS;



            case "market.history":

                return NavigationAction.MARKET_HISTORY;



            case "market.chart":

                return NavigationAction.MARKET_CHART;



            case "menu.market":

                return NavigationAction.MARKET;



            case "menu.calculate":

                return NavigationAction.CALCULATE;



            case "menu.assistant":

                return NavigationAction.ASSISTANT;



            case "menu.settings":

                return NavigationAction.SETTINGS;



            default:

                return item.id.replace(".", ":");

        }

    }


}