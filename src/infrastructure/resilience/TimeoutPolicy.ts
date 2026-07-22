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


        return Promise.race([


            operation(),



            new Promise<T>(

                (_, reject) => {


                    setTimeout(

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

            )


        ]);


    }


}