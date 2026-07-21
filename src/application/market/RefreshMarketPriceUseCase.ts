import { MarketPrice } from "../../domain/market/entities/MarketPrice";
import { PriceRefreshService } from "./services/PriceRefreshService";



export class RefreshMarketPriceUseCase {



    constructor(

        private readonly refreshService:
            PriceRefreshService

    ) {}





    async execute():
        Promise<MarketPrice> {


        return this.refreshService.refresh();


    }


}