export interface TimeoutPolicyOptions {

    timeoutMs: number;

}



export class TimeoutPolicy {



    constructor(

        private readonly options:
            TimeoutPolicyOptions

    ) {}



    async execute<T>(

        operation:
            () => Promise<T>

    ): Promise<T> {


        let timer:
            ReturnType<typeof setTimeout>;



        const timeoutPromise =

            new Promise<T>(

                (_, reject) => {


                    timer = setTimeout(

                        () => {


                            reject(

                                new Error(
                                    "Operation timeout"
                                )

                            );


                        },

                        this.options.timeoutMs

                    );


                }

            );



        try {


            return await Promise.race([

                operation(),

                timeoutPromise

            ]);



        }
        finally {


            clearTimeout(
                timer!
            );


        }


    }


}