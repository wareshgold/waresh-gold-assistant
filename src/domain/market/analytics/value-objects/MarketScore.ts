export class MarketScore {


    private constructor(

        private readonly _value:
            number

    ) {


        if (

            valueOutOfRange(_value)

        ) {

            throw new Error(
                "Market score must be between 0 and 100"
            );

        }


    }







    static create(

        value:
            number

    ):

        MarketScore {


        return new MarketScore(

            Math.round(value)

        );


    }








    get value():

        number {

        return this._value;

    }








    get level():

        string {


        if (this._value >= 80) {

            return "STRONG";

        }


        if (this._value >= 60) {

            return "POSITIVE";

        }


        if (this._value >= 40) {

            return "NEUTRAL";

        }


        if (this._value >= 20) {

            return "NEGATIVE";

        }


        return "WEAK";


    }








    get emoji():

        string {


        if (this._value >= 80) {

            return "🟢";

        }


        if (this._value >= 60) {

            return "🟩";

        }


        if (this._value >= 40) {

            return "🟡";

        }


        if (this._value >= 20) {

            return "🟠";

        }


        return "🔴";


    }








    get formatted():

        string {


        return `${this.emoji} ${this._value}/100`;

    }







    equals(

        other:
            MarketScore

    ):

        boolean {


        return (

            this._value === other._value

        );


    }



}







function valueOutOfRange(

    value:
        number

):

    boolean {


    return (

        value < 0 ||

        value > 100

    );


}