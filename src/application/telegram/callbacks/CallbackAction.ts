export enum CallbackNamespace {

    MENU = "menu",

    GOLD = "gold",

    MARKET = "market",

    CALCULATOR = "calculator",

    ASSISTANT = "assistant",

    SETTINGS = "settings",

    ALERTS = "alerts",

    BUBBLE = "bubble",

    SYSTEM = "system",

}







export enum MenuCallbackAction {

    MAIN = "main",

    MARKET = "market",

    CALCULATE = "calculate",

    ASSISTANT = "assistant",

    SETTINGS = "settings",

    BACK = "back",

}







export enum CalculatorCallbackAction {

    GOLD_PRICE = "gold-price",

    LIVE_PRICE = "live-price",

    INVOICE = "invoice",

    FORMULA = "formula",

    REVERSE_LABOR = "reverse-labor",

}







export enum MarketCallbackAction {

    CHART = "chart",

    HISTORY = "history",

    ANALYTICS = "analytics",

}







export interface CallbackAction {


    namespace:

        CallbackNamespace;




    action:

        string;




    payload?:

        string;



}