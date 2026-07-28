import {
    TelegramMenuItem,
} from "./TelegramMenuItem";



export class TelegramMenuCallbackResolver {



    resolve(

        item: TelegramMenuItem

    ): string {



        switch (item.id) {



            case "gold.price":

                return "gold:price";



            case "gold.bubble":

                return "gold:bubble";



            case "calculate.gold-price":

                return "command:calc";



            case "market.analytics":

                return "market:analytics";



            case "market.history":

                return "market:history";



            case "market.chart":

                return "market:chart";



            case "menu.market":

                return "menu:market";



            case "menu.calculate":

                return "menu:calculate";



            case "menu.assistant":

                return "menu:assistant";



            case "menu.settings":

                return "menu:settings";



            default:

                return item.id.replace(".", ":");

        }

    }


}