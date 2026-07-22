import { ApplicationResponse }
from "../common/models/ApplicationResponse";

import { MarketIntelligenceService }
from "./services/MarketIntelligenceService";





export class GetMarketIntelligenceUseCase {





    constructor(

        private readonly service:
            MarketIntelligenceService

    ) {}








    async execute():

        Promise<ApplicationResponse> {





        const intelligence =

            await this.service
                .analyze();








        if (!intelligence) {



            return {


                type: "text",


                content:

                    "⚠️ اطلاعات هوش بازار در دسترس نیست"



            };


        }








        const risk =

            intelligence
                .getRiskLevel();





        const bubble =

            intelligence
                .getBubbleStatus();





        const signal =

            intelligence
                .getSignal();








        return {


            type: "text",





            content:


                [

                    "🧠 هوش بازار طلا",

                    "",


                    `⚠️ سطح ریسک: ${risk.toString()}`,


                    "",


                    `🟡 وضعیت حباب: ${bubble.toString()}`,


                    "",


                    `📡 سیگنال بازار: ${signal.toString()}`,


                    "",


                    `🕒 زمان تحلیل: ${
                        intelligence
                            .getGeneratedAt()
                            .toLocaleString("fa-IR")
                    }`


                ].join("\n"),






            metadata: {


                riskLevel:

                    risk.type,



                bubbleStatus:

                    bubble.type,



                signal:

                    signal.type,



                generatedAt:

                    intelligence
                        .getGeneratedAt()
                        .toISOString()



            }


        };



    }





}