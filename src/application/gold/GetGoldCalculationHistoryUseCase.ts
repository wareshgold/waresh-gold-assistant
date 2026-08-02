import { GoldCalculationHistory }
from "../../domain/gold/entities/GoldCalculationHistory";


import { GoldCalculationHistoryRepository }
from "../../domain/gold/repositories/GoldCalculationHistoryRepository";



export class GetGoldCalculationHistoryUseCase {



    constructor(

        private readonly repository:
            GoldCalculationHistoryRepository

    ) {}




    async execute(

        userId: string,

        limit: number = 10

    ):
    Promise<GoldCalculationHistory[]> {


        return this.repository.getByUserId(

            userId,

            limit

        );


    }


}