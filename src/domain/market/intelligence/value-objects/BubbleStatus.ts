export enum BubbleStatusType {

    NORMAL = "NORMAL",

    WARNING = "WARNING",

    DANGEROUS = "DANGEROUS"

}





export class BubbleStatus {


    private constructor(

        private readonly _type:
            BubbleStatusType

    ) {}





    static normal():

        BubbleStatus {

        return new BubbleStatus(

            BubbleStatusType.NORMAL

        );

    }





    static warning():

        BubbleStatus {

        return new BubbleStatus(

            BubbleStatusType.WARNING

        );

    }





    static dangerous():

        BubbleStatus {

        return new BubbleStatus(

            BubbleStatusType.DANGEROUS

        );

    }





    static fromPercentage(

        percentage: number

    ):

        BubbleStatus {


        if (percentage < 2) {

            return BubbleStatus.normal();

        }


        if (percentage < 5) {

            return BubbleStatus.warning();

        }


        return BubbleStatus.dangerous();


    }





    get type():

        BubbleStatusType {

        return this._type;

    }





    get isNormal():

        boolean {

        return (

            this._type ===

            BubbleStatusType.NORMAL

        );

    }





    get isWarning():

        boolean {

        return (

            this._type ===

            BubbleStatusType.WARNING

        );

    }





    get isDangerous():

        boolean {

        return (

            this._type ===

            BubbleStatusType.DANGEROUS

        );

    }





    equals(

        other: BubbleStatus

    ):

        boolean {

        return (

            this._type === other._type

        );

    }





    toString():

        string {

        return this._type;

    }


}