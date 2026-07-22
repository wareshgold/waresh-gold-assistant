export interface RetryPolicyOptions {

    maxAttempts: number;

    delayMs: number;

}



export class RetryPolicy {


    constructor(

        private readonly options:
            RetryPolicyOptions

    ) {}



    async execute<T>(

        operation:
            () => Promise<T>

    ): Promise<T> {


        let lastError:
            unknown;



        for (
            let attempt = 1;
            attempt <= this.options.maxAttempts;
            attempt++
        ) {


            try {


                return await operation();


            }
            catch(error) {


                lastError = error;



                if (
                    attempt <
                    this.options.maxAttempts
                ) {


                    await this.delay();


                }


            }


        }



        throw lastError;


    }




    private async delay():
        Promise<void> {


        if (
            this.options.delayMs <= 0
        ) {


            return;


        }



        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    this.options.delayMs
                )
        );


    }


}