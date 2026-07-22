export interface RetryPolicyOptions {

    retries: number;

    delayMs: number;

}



export class RetryPolicy {


    constructor(
        private readonly options: RetryPolicyOptions
    ) {}



    async execute<T>(
        action: () => Promise<T>
    ): Promise<T> {


        let lastError: unknown;



        for(
            let attempt = 0;
            attempt <= this.options.retries;
            attempt++
        ) {


            try {

                return await action();

            }
            catch(error) {

                lastError = error;



                if(
                    attempt < this.options.retries &&
                    this.options.delayMs > 0
                ) {

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                this.options.delayMs
                            )
                    );

                }


            }


        }



        throw lastError;

    }


}