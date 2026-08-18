import {
    AIToolExecutionService
} from "./AIToolExecutionService";


import {
    AIToolResult
} from "../tools/AIToolResult";


import {
    AIRequest
} from "../models/AIRequest";



export interface AILocalToolRouteResult {


    handled:

        boolean;



    toolName?:

        string;



    toolResult?:

        AIToolResult;



    response?:

        string;


}



export class AILocalToolRouter {



    constructor(

        private readonly toolExecutionService:

            AIToolExecutionService

    ) {}





    async route(

        request:

            AIRequest

    ):

        Promise<AILocalToolRouteResult> {



        const message =

            this.normalize(

                request.message

            );





        const toolName =

            this.resolveTool(

                message

            );





        if (!toolName) {


            return {

                handled:

                    false

            };


        }





        const toolResult =

            await this.toolExecutionService.executeIfRequired(

                {

                    content:

                        "",

                    toolCalls:

                    [

                        {

                            id:

                                `local-${Date.now()}`,

                            name:

                                toolName,

                            arguments:

                                {}

                        }

                    ]

                },

                {

                    userId:

                        request.userId,

                    metadata:

                        request.context

                }

            );





        if (!toolResult) {


            return {

                handled:

                    true,

                toolName,

                response:

                    "متأسفانه اجرای ابزار موردنظر انجام نشد."

            };


        }





        return {

            handled:

                true,

            toolName,

            toolResult,

            response:

                this.buildResponse(

                    toolName,

                    toolResult

                )

        };


    }







    private resolveTool(

        message:

            string

    ):

        string | undefined {



        if (

            this.isCurrentGoldPriceRequest(

                message

            )

        ) {


            return "get_current_gold_price";


        }





        if (

            this.isCurrentMithqalPriceRequest(

                message

            )

        ) {


            return "get_current_gold_mithqal_price";


        }





        return undefined;


    }







    private isCurrentGoldPriceRequest(

        message:

            string

    ):

        boolean {



        const hasGold =

            /(طلا|طلای|زر)/i.test(

                message

            );



        const hasPrice =

            /(قیمت|نرخ|چنده|چند|چند شده|چند است|چند شده)/i.test(

                message

            );



        const hasMithqal =

            /(مثقال|مثقالی)/i.test(

                message

            );



        const hasWeight =

            /(\d+(?:[.,]\d+)?)\s*(گرم|گرم?ی|kg|کیلو)/i.test(

                message

            );



        const hasCalculationIntent =

            /(حساب|محاسبه|فاکتور|اجرت|سود|مالیات|تخفیف|خرید|فروش)/i.test(

                message

            );



        return (

            hasGold &&

            hasPrice &&

            !hasMithqal &&

            !hasWeight &&

            !hasCalculationIntent

        );


    }







    private isCurrentMithqalPriceRequest(

        message:

            string

    ):

        boolean {



        const hasMithqal =

            /(مثقال|مثقالی)/i.test(

                message

            );



        const hasPrice =

            /(قیمت|نرخ|چنده|چند|چند است|چند شده)/i.test(

                message

            );



        return (

            hasMithqal &&

            hasPrice

        );


    }







    private buildResponse(

        toolName:

            string,

        result:

            AIToolResult

    ):

        string {



        if (

            !result.success

        ) {


            return (

                result.error ??

                "دریافت قیمت با خطا مواجه شد."

            );


        }





        if (

            toolName ===

            "get_current_gold_price"

        ) {


            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const price =

                data?.price;



            if (

                typeof price ===

                "number"

            ) {


                return (

                    `قیمت فعلی طلای ۱۸ عیار: ` +

                    `${this.formatNumber(price)} تومان`

                );


            }


        }





        if (

            toolName ===

            "get_current_gold_mithqal_price"

        ) {


            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const price =

                data?.price;



            if (

                typeof price ===

                "number"

            ) {


                return (

                    `قیمت فعلی مثقال طلا: ` +

                    `${this.formatNumber(price)} تومان`

                );


            }


        }





        return (

            "اطلاعات قیمت دریافت شد."

        );


    }







    private formatNumber(

        value:

            number

    ):

        string {



        return new Intl.NumberFormat(

            "en-US",

            {

                maximumFractionDigits:

                    2

            }

        ).format(

            value

        );


    }







    private normalize(

        message:

            string

    ):

        string {



        return message

            .trim()

            .toLowerCase()

            .replace(

                /ي/g,

                "ی"

            )

            .replace(

                /ك/g,

                "ک"

            )

            .replace(

                /ۀ/g,

                "ه"

            )

            .replace(

                /\s+/g,

                " "

            );


    }


}