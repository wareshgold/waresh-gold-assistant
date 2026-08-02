import { describe, expect, it } from "vitest";

import { GoldCalculationConversationFlow }
from "./GoldCalculationConversationFlow";

import { MemoryTelegramSessionStore }
from "../state/MemoryTelegramSessionStore";

import { CalculateGoldFormulaUseCase }
from "../../gold/CalculateGoldFormulaUseCase";

import { createGoldRuleEngine }
from "../../../domain/gold/services/createGoldRuleEngine";

import { GoldCalculationWorkflow }
from "../../gold/workflows/GoldCalculationWorkflow";



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
                        useCase
                    );



                const flow =
                    new GoldCalculationConversationFlow(

                        sessionStore,

                        workflow

                    );



                await sessionStore.save({

                    userId:
                        "user-1",

                    state:
                        "GOLD_CALCULATION_WAITING_WEIGHT",

                    data:
                        {},

                    updatedAt:
                        Date.now()

                });



                await flow.execute(
                    "user-1",
                    "5"
                );


                await flow.execute(
                    "user-1",
                    "18000000"
                );


                await flow.execute(
                    "user-1",
                    "15"
                );


                await flow.execute(
                    "user-1",
                    "7"
                );


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