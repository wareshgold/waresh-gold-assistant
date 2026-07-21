import { describe, expect, it } from "vitest";

import { RandomWelcomeMessageProvider }
from "../../../../src/application/telegram/welcome/RandomWelcomeMessageProvider";



describe(
    "RandomWelcomeMessageProvider",
    ()=>{



        it(
            "should return welcome message",
            ()=>{


                const provider =
                    new RandomWelcomeMessageProvider();



                const result =
                    provider.getWelcomeMessage();



                expect(result)
                    .toBeTruthy();



                expect(result.length)
                    .toBeGreaterThan(0);


            }
        );





        it(
            "should include first name when provided",
            ()=>{


                const provider =
                    new RandomWelcomeMessageProvider();



                const result =
                    provider.getWelcomeMessage(
                        "علی"
                    );



                expect(result)
                    .toContain(
                        "علی جان"
                    );


            }
        );





        it(
            "should fallback to username",
            ()=>{


                const provider =
                    new RandomWelcomeMessageProvider();



                const result =
                    provider.getWelcomeMessage(

                        undefined,

                        "ali_gold"

                    );



                expect(result)
                    .toContain(
                        "ali_gold جان"
                    );


            }
        );


    }
);