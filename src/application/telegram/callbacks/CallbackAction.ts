export enum CallbackNamespace {

    MENU = "menu",

    GOLD = "gold",

    MARKET = "market",

    CALCULATOR = "calculator",

    ASSISTANT = "assistant",

    SETTINGS = "settings",

    SYSTEM = "system",

}




export interface CallbackAction {


    namespace:

        CallbackNamespace;



    action:

        string;



    payload?:

        string;


}