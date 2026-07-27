import { describe, expect, it } from "vitest";

import { CalculateGoldCommandHandler }
from "../../../../../src/application/telegram/commands/handlers/CalculateGoldCommandHandler";


import { CalculateGoldFormulaUseCase }
from "../../../../../src/application/gold/CalculateGoldFormulaUseCase";



describe(
    "CalculateGoldCommandHandler",
    () => {


        class FakeCalculateGoldFormulaUseCase
        implements Pick<CalculateGoldFormulaUseCase, "execute"> {


            execute() {

                return {

                    goldValue: 90000000,

                    labor: 13500000,

                    profit: 7245000,

                    tax: 1867050,

                    finalPrice: 112612050

                };

            }

        }



        const createHandler = () => {

            return new CalculateGoldCommandHandler(
                new FakeCalculateGoldFormulaUseCase()
            );

        };



        it(
            "should handle /calc command",
            () => {


                const handler =
                    createHandler();



                expect(
                    handler.canHandle("/calc")
                )
                .toBe(true);


            }
        );





        it(
            "should return calculated gold response",
            async () => {


                const handler =
                    createHandler();



                const result =
                    await handler.execute({

                        chatId: "",

                        command: "/calc",

                        arguments: [
                            "5",
                            "18000000",
                            "15",
                            "7",
                            "9"
                        ]

                    });



                expect(
                    result
                )
                .toContain(
                    "قیمت نهایی"
                );



                expect(
                    result
                )
                .toContain(
                    "۱۱۲٬۶۱۲٬۰۵۰"
                );


            }
        );





        it(
            "should reject invalid arguments",
            async () => {


                const handler =
                    createHandler();



                const result =
                    await handler.execute({

                        chatId: "",

                        command: "/calc",

                        arguments: [
                            "5"
                        ]

                    });



                expect(
                    result
                )
                .toContain(
                    "فرمت اشتباه"
                );


            }
        );


    }
);