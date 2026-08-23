export interface AIToolSchema<TInput> {


    safeParse(

        input: unknown

    ):

    | {

        success: true;

        data: TInput;

    }

    | {

        success: false;

        error: unknown;

    };


    parse?(

        input: unknown

    ): TInput;


}