export interface MarketMessageProvider {


    getLatestMessage():
        Promise<string>;



}