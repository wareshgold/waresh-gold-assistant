export interface GoldCalculationInput {

    weight: number;

    goldPrice: number;

    laborPercent: number;

    profitPercent: number;

    taxPercent: number;

    discount: number;

}



export class GoldCalculationInputParser {


    parse(
        argumentsList: string[]
    ): GoldCalculationInput {


        if (
            argumentsList.length < 5
        ) {

            throw new Error(
                "Invalid gold calculation arguments"
            );

        }



        const values =
            argumentsList.map(
                Number
            );



        if (
            values.some(
                value =>
                    Number.isNaN(value)
            )
        ) {

            throw new Error(
                "Gold calculation arguments must be numbers"
            );

        }



        const [
            weight,
            goldPrice,
            laborPercent,
            profitPercent,
            taxPercent
        ] = values;



        return {

            weight,

            goldPrice,

            laborPercent,

            profitPercent,

            taxPercent,

            discount: 0

        };


    }


}