import { describe, expect, it } from "vitest";

import {
    TimeoutPolicy
}
from "./TimeoutPolicy";



describe("TimeoutPolicy", () => {



    it("should return result when operation completes before timeout", async () => {


        const timeoutPolicy =

            new TimeoutPolicy({

                timeoutMs: 100

            });



        const result =

            await timeoutPolicy.execute(

                async () => {


                    return "success";


                }

            );



        expect(result)
            .toBe("success");


    });





    it("should throw timeout error when operation takes too long", async () => {



        const timeoutPolicy =

            new TimeoutPolicy({

                timeoutMs: 20

            });



        await expect(


            timeoutPolicy.execute(

                async () => {


                    await new Promise(

                        resolve =>
                            setTimeout(
                                resolve,
                                100
                            )

                    );


                    return "late";


                }

            )


        )
        .rejects
        .toThrow(

            "Operation timeout"

        );


    });



});