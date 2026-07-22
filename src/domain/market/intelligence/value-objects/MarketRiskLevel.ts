export enum MarketRiskLevelType {

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH"

}




export class MarketRiskLevel {


    private constructor(

        private readonly _type:
            MarketRiskLevelType

    ) {}





    static low():

        MarketRiskLevel {

        return new MarketRiskLevel(

            MarketRiskLevelType.LOW

        );

    }





    static medium():

        MarketRiskLevel {

        return new MarketRiskLevel(

            MarketRiskLevelType.MEDIUM

        );

    }





    static high():

        MarketRiskLevel {

        return new MarketRiskLevel(

            MarketRiskLevelType.HIGH

        );

    }





    get type():

        MarketRiskLevelType {

        return this._type;

    }





    get isLow():

        boolean {

        return (

            this._type ===

            MarketRiskLevelType.LOW

        );

    }





    get isMedium():

        boolean {

        return (

            this._type ===

            MarketRiskLevelType.MEDIUM

        );

    }





    get isHigh():

        boolean {

        return (

            this._type ===

            MarketRiskLevelType.HIGH

        );

    }





    equals(

        other: MarketRiskLevel

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