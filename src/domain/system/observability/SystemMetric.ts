export class SystemMetric {


    constructor(

        public readonly name:
            string,


        public readonly value:
            number,


        public readonly timestamp:
            Date

    ) {}



    static create(

        name: string,

        value: number

    ):
    SystemMetric {


        return new SystemMetric(

            name,

            value,

            new Date()

        );


    }


}