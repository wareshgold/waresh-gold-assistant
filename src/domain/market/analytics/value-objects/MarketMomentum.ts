export enum MarketMomentumType {

    STRONG_UP = "STRONG_UP",

    WEAK_UP = "WEAK_UP",

    NEUTRAL = "NEUTRAL",

    WEAK_DOWN = "WEAK_DOWN",

    STRONG_DOWN = "STRONG_DOWN"

}




export class MarketMomentum {


    private constructor(

        private readonly _type:
            MarketMomentumType

    ) {}





    static strongUp():

        MarketMomentum {

        return new MarketMomentum(

            MarketMomentumType.STRONG_UP

        );

    }





    static weakUp():

        MarketMomentum {

        return new MarketMomentum(

            MarketMomentumType.WEAK_UP

        );

    }





    static neutral():

        MarketMomentum {

        return new MarketMomentum(

            MarketMomentumType.NEUTRAL

        );

    }





    static weakDown():

        MarketMomentum {

        return new MarketMomentum(

            MarketMomentumType.WEAK_DOWN

        );

    }





    static strongDown():

        MarketMomentum {

        return new MarketMomentum(

            MarketMomentumType.STRONG_DOWN

        );

    }





    get type():

        MarketMomentumType {

        return this._type;

    }





    get emoji():

        string {

        switch(this._type) {

            case MarketMomentumType.STRONG_UP:
                return "🚀";


            case MarketMomentumType.WEAK_UP:
                return "📈";


            case MarketMomentumType.NEUTRAL:
                return "➡️";


            case MarketMomentumType.WEAK_DOWN:
                return "📉";


            case MarketMomentumType.STRONG_DOWN:
                return "🔻";


        }

    }





    equals(

        other:
            MarketMomentum

    ):

        boolean {

        return this._type === other._type;

    }





    toString():

        string {

        return this._type;

    }


}