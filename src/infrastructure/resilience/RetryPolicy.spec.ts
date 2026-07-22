import { describe, expect, it } from "vitest";
import { RetryPolicy } from "./RetryPolicy";



describe("RetryPolicy", () => {



    it("should return result when operation succeeds", async () => {



        const retryPolicy =
            new RetryPolicy({

                maxAttempts: 3,

                delayMs: 0

            });



        const result =
            await retryPolicy.execute(
                async () => {

                    return "success";

                }
            );



        expect(result)
            .toBe("success");


    });





    it("should retry failed operation and succeed", async () => {



        const retryPolicy =
            new RetryPolicy({

                maxAttempts: 3,

                delayMs: 0

            });



        let attempts = 0;



        const result =
            await retryPolicy.execute(
                async () => {


                    attempts++;



                    if (
                        attempts < 3
                    ) {


                        throw new Error(
                            "temporary failure"
                        );


                    }



                    return "success";


                }
            );



        expect(result)
            .toBe("success");



        expect(attempts)
            .toBe(3);


    });





    it("should throw error after all attempts fail", async () => {



        const retryPolicy =
            new RetryPolicy({

                maxAttempts: 3,

                delayMs: 0

            });



        await expect(

            retryPolicy.execute(

                async () => {


                    throw new Error(
                        "failed permanently"
                    );


                }

            )

        )
        .rejects
        .toThrow(
            "failed permanently"
        );


    });



});