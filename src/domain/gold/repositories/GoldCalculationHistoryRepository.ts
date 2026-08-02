import { GoldCalculationHistory } 
from "../entities/GoldCalculationHistory";



export interface GoldCalculationHistoryRepository {


    save(
        history: GoldCalculationHistory
    ):
    Promise<void>;



    getByUserId(
        userId: string,
        limit?: number
    ):
    Promise<GoldCalculationHistory[]>;


}