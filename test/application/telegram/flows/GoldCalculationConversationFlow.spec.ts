import { describe, it, expect } from "vitest";


import {
    GoldCalculationConversationFlow
}
from "../../../../src/application/telegram/flows/GoldCalculationConversationFlow";


import {
    GoldCalculationWorkflow
}
from "../../../../src/application/gold/workflows/GoldCalculationWorkflow";


import {
    GoldCalculationValidator
}
from "../../../../src/application/gold/validation/GoldCalculationValidator";


import {
    createGoldCalculationSessionData
}
from "../../../../src/application/gold/workflows/GoldCalculationSessionData";


import {
    GoldCalculationStep
}
from "../../../../src/application/gold/workflows/GoldCalculationStep";


import {
    TelegramSessionStore
}
from "../../../../src/application/telegram/state/TelegramSessionStore";





class MemoryStore

implements TelegramSessionStore {


    private session:any;



    async get() {

        return this.session ?? null;

    }



    async save(session:any) {

        this.session = session;

    }



    async delete() {

        this.session = null;

    }


}







class FakeWorkflow

extends GoldCalculationWorkflow {


    constructor() {

        super(
            {} as any,
            new GoldCalculationValidator()
        );

    }




    override execute(
        step:any,
        data:any,
        value:number
    ) {


        return {

            completed:false,


            nextStep:
                GoldCalculationStep.WAITING_PRICE_SELECTION,


            updatedData:data

        };

    }


}








describe(
    "GoldCalculationConversationFlow",
    () => {




        it(
            "should reject missing session",
            async () => {


                const store =
                    new MemoryStore();



                const flow =
                    new GoldCalculationConversationFlow(


                        store,


                        new FakeWorkflow(),


                        {
                            format: () => ({
                                text:"result"
                            })
                        } as any,


                        {
                            execute:
                                async () => {}
                        } as any


                    );




                const response =
                    await flow.execute(

                        "user-1",

                        "5"

                    );




                expect(
                    response.content
                )
                .toContain(
                    "جلسه محاسبه"
                );


            }
        );









        it(
            "should handle weight input",
            async () => {


                const store =
                    new MemoryStore();




                await store.save({

                    userId:
                        "user-1",


                    state:
                        GoldCalculationStep.WAITING_WEIGHT,


                    data:
                        createGoldCalculationSessionData(),


                    updatedAt:
                        Date.now()

                });








                const flow =
                    new GoldCalculationConversationFlow(


                        store,


                        new FakeWorkflow(),


                        {
                            format: () => ({

                                text:
                                    "💰 انتخاب قیمت طلا"

                            })
                        } as any,


                        {
                            execute:
                                async () => {}
                        } as any


                    );








                const response =
                    await flow.execute(

                        "user-1",

                        "5"

                    );





                expect(
                    response.content
                )
                .toContain(
                    "انتخاب قیمت طلا"
                );



            }
        );






    }
);