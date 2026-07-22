export enum MarketSignalType {

    BUY_PRESSURE = "BUY_PRESSURE",

    WAIT = "WAIT",

    SELL_PRESSURE = "SELL_PRESSURE"

}





export class MarketSignal {


    private constructor(

        private readonly _type:
            MarketSignalType

    ) {}





    static buyPressure():

        MarketSignal {

        return new MarketSignal(

            MarketSignalType.BUY_PRESSURE

        );

    }





    static wait():

        MarketSignal {

        return new MarketSignal(

            MarketSignalType.WAIT

        );

    }





    static sellPressure():

        MarketSignal {

        return new MarketSignal(

            MarketSignalType.SELL_PRESSURE

        );

    }





    get type():

        MarketSignalType {

        return this._type;

    }





    get isBuyPressure():

        boolean {

        return (

            this._type ===

            MarketSignalType.BUY_PRESSURE

        );

    }





    get isWait():

        boolean {

        return (

            this._type ===

            MarketSignalType.WAIT

        );

    }





    get isSellPressure():

        boolean {

        return (

            this._type ===

            MarketSignalType.SELL_PRESSURE

        );

    }





    equals(

        other: MarketSignal

    ):

        boolean {

        return (

            this._type === other._type

        );

    }





    toString():

        string {

        return this._type;

    }


}