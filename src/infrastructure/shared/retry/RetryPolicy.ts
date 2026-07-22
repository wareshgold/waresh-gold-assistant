import {
    RetryPolicy as ResilienceRetryPolicy
}
from "../../resilience/RetryPolicy";



export interface RetryPolicyOptions {

    retries: number;

    delayMs: number;

}



export class RetryPolicy
extends ResilienceRetryPolicy {



    constructor(
        options: RetryPolicyOptions
    ) {


        super({

            maxAttempts:
                options.retries + 1,


            delayMs:
                options.delayMs

        });


    }


}