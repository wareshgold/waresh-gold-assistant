import {
    describe,
    expect,
    it
} from "vitest";


import {
    AIToolInputValidator
} from "./AIToolInputValidator";



describe(
    "AIToolInputValidator",
    () => {


        it(
            "should pass when schema is missing",
            () => {


                const validator =

                    new AIToolInputValidator();



                const result =

                    validator.validate(

                        undefined,

                        {

                            value:

                                123

                        }

                    );



                expect(

                    result.success

                )

                    .toBe(true);



            }
        );





        it(
            "should validate zod compatible schema",
            () => {


                const validator =

                    new AIToolInputValidator();



                const schema = {


                    safeParse(

                        value: unknown

                    ) {


                        if (

                            typeof value === "object"

                        ) {


                            return {

                                success:

                                    true,


                                data:

                                    value

                            };

                        }


                        return {

                            success:

                                false,


                            error:

                                "invalid"

                        };


                    }


                };




                const result =

                    validator.validate(

                        schema,

                        {

                            weight:

                                2

                        }

                    );



                expect(

                    result.success

                )

                    .toBe(true);



            }
        );





        it(
            "should fail invalid schema input",
            () => {


                const validator =

                    new AIToolInputValidator();



                const schema = {


                    safeParse() {


                        return {

                            success:

                                false,


                            error:

                                new Error(

                                    "invalid input"

                                )

                        };


                    }


                };



                const result =

                    validator.validate(

                        schema,

                        {}

                    );



                expect(

                    result.success

                )

                    .toBe(false);



                expect(

                    result.error

                )

                    .toContain(

                        "invalid input"

                    );


            }
        );


    }
);