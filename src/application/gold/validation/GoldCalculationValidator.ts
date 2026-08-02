import {
    GoldCalculationSessionData
}
from "../workflows/GoldCalculationSessionData";



export interface GoldCalculationValidationResult {

    valid: boolean;

    errors: string[];

}



export class GoldCalculationValidator {



    validate(

        data: GoldCalculationSessionData

    ): GoldCalculationValidationResult {



        const errors: string[] = [];





        if (

            data.weight === undefined ||

            data.weight <= 0

        ) {


            errors.push(

                "Invalid weight"

            );


        }





        if (

            data.goldPrice === undefined ||

            data.goldPrice <= 0

        ) {


            errors.push(

                "Invalid gold price"

            );


        }





        if (

            data.laborPercent === undefined ||

            data.laborPercent < 0

        ) {


            errors.push(

                "Invalid labor percent"

            );


        }





        if (

            data.profitPercent === undefined ||

            data.profitPercent < 0

        ) {


            errors.push(

                "Invalid profit percent"

            );


        }





        if (

            data.taxPercent !== undefined &&

            data.taxPercent < 0

        ) {


            errors.push(

                "Invalid tax percent"

            );


        }





        return {


            valid:

                errors.length === 0,


            errors


        };


    }


}