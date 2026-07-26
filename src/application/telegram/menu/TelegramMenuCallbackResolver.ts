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



            case "gold.calculate":

                return "command:calc";



            case "market.analytics":

                return "market:analytics";



            case "market.history":

                return "market:history";



            default:

                return item.id.replace(".", ":");

        }

    }


}