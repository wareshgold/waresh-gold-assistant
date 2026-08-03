import { describe, expect, it } from "vitest";


import { GoldCalculationConversationFlow }
from "./GoldCalculationConversationFlow";


import { MemoryTelegramSessionStore }
from "../state/MemoryTelegramSessionStore";


import { CalculateGoldFormulaUseCase }
from "../../gold/CalculateGoldFormulaUseCase";


import { GoldCalculationWorkflow }
from "../../gold/workflows/GoldCalculationWorkflow";


import { GoldCalculationValidator }
from "../../gold/validation/GoldCalculationValidator";


import { createGoldRuleEngine }
from "../../../domain/gold/services/createGoldRuleEngine";


import { GoldCalculationResultFormatter }
from "../presentation/GoldCalculationResultFormatter";


import { TelegramNumberFormatter }
from "../presentation/TelegramNumberFormatter";


import { SaveGoldCalculationHistoryUseCase }
from "../../gold/SaveGoldCalculationHistoryUseCase";





describe(
    "GoldCalculationConversationFlow",
    ()=>{


        it(
            "should calculate gold through conversation steps",
            async()=>{


                const sessionStore =
                    new MemoryTelegramSessionStore();



                const useCase =
                    new CalculateGoldFormulaUseCase(
                        createGoldRuleEngine()
                    );



                const workflow =
                    new GoldCalculationWorkflow(

                        useCase,

                        new GoldCalculationValidator()

                    );



                const resultFormatter =

                    new GoldCalculationResultFormatter(

                        new TelegramNumberFormatter()

                    );



                const historyRepository = {

                    async save() {},


                    async getByUserId() {

                        return [];

                    }

                };



                const saveHistoryUseCase =

                    new SaveGoldCalculationHistoryUseCase(

                        historyRepository

                    );



                const flow =

                    new GoldCalculationConversationFlow(

                        sessionStore,

                        workflow,

                        resultFormatter,

                        saveHistoryUseCase

                    );



                await sessionStore.save({

                    userId:
                        "user-1",

                    state:
                        "GOLD_CALCULATION_WAITING_WEIGHT",

                    data: {

                        weight: null,

                        goldPrice: null,

                        priceSource: null,

                        laborPercent: null,

                        profitPercent: null,

                        taxPercent: null,

                        discount: null

                    },

                    updatedAt:
                        Date.now()

                });





                // Weight

                await flow.execute(

                    "user-1",

                    "5"

                );





                // Select manual price

                await flow.execute(

                    "user-1",

                    "MANUAL"

                );





                // Gold price

                await flow.execute(

                    "user-1",

                    "18000000"

                );





                // Labor

                await flow.execute(

                    "user-1",

                    "15"

                );





                // Profit

                await flow.execute(

                    "user-1",

                    "7"

                );





                // Tax -> Calculate

                const result =

                    await flow.execute(

                        "user-1",

                        "9"

                    );





                expect(

                    result.type

                )

                .toBe(

                    "text"

                );





                expect(

                    result.content

                )

                .contain(

                    "نتیجه محاسبه طلا"

                );





                const session =

                    await sessionStore.get(

                        "user-1"

                    );





                expect(session)

                    .toBeNull();


            }

        );


    }

);