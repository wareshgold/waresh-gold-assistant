export enum MarketPositionType {

    NEAR_LOW = "NEAR_LOW",

    LOWER_AREA = "LOWER_AREA",

    MIDDLE = "MIDDLE",

    UPPER_AREA = "UPPER_AREA",

    NEAR_HIGH = "NEAR_HIGH"

}





export class MarketPosition {


    private constructor(

        private readonly _type:
            MarketPositionType

    ) {}





    static nearLow():

        MarketPosition {

        return new MarketPosition(
            MarketPositionType.NEAR_LOW
        );

    }





    static lowerArea():

        MarketPosition {

        return new MarketPosition(
            MarketPositionType.LOWER_AREA
        );

    }





    static middle():

        MarketPosition {

        return new MarketPosition(
            MarketPositionType.MIDDLE
        );

    }





    static upperArea():

        MarketPosition {

        return new MarketPosition(
            MarketPositionType.UPPER_AREA
        );

    }





    static nearHigh():

        MarketPosition {

        return new MarketPosition(
            MarketPositionType.NEAR_HIGH
        );

    }





    get type():

        MarketPositionType {

        return this._type;

    }





    get emoji():

        string {

        switch(this._type) {

            case MarketPositionType.NEAR_LOW:
                return "🟢";


            case MarketPositionType.LOWER_AREA:
                return "🟩";


            case MarketPositionType.MIDDLE:
                return "🟡";


            case MarketPositionType.UPPER_AREA:
                return "🟧";


            case MarketPositionType.NEAR_HIGH:
                return "🔴";

        }

    }





    toString():

        string {

        return this._type;

    }


}