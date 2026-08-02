export interface GoldCalculationInputSnapshot {

    weight?: number;

    goldPrice?: number;

    laborPercent?: number;

    profitPercent?: number;

    taxPercent?: number;

    discount?: number;

}





export interface GoldCalculationResultSnapshot {


    goldValue: number;


    labor: number;


    profit: number;


    tax: number;


    finalPrice: number;


}







export class GoldCalculationHistory {



    constructor(



        public readonly userId: string,



        public readonly input:

            GoldCalculationInputSnapshot,



        public readonly result:

            GoldCalculationResultSnapshot,



        public readonly createdAt:

            Date = new Date()



    ) {



        if (!userId) {


            throw new Error(

                "Gold calculation history requires user id"

            );


        }


    }



}