import { MarketRiskLevel }
from "../value-objects/MarketRiskLevel";

import { BubbleStatus }
from "../value-objects/BubbleStatus";

import { MarketSignal }
from "../value-objects/MarketSignal";



export class MarketIntelligence {



    constructor(


        private readonly riskLevel:
            MarketRiskLevel,


        private readonly bubbleStatus:
            BubbleStatus,


        private readonly signal:
            MarketSignal,


        private readonly generatedAt:
            Date


    ) {}





    getRiskLevel():

        MarketRiskLevel {

        return this.riskLevel;

    }





    getBubbleStatus():

        BubbleStatus {

        return this.bubbleStatus;

    }





    getSignal():

        MarketSignal {

        return this.signal;

    }





    getGeneratedAt():

        Date {

        return this.generatedAt;

    }


}