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





        const reverseLabor =

            this.parseReverseLaborRequest(
                message
            );



        if (reverseLabor) {



            return this.executeTool(

                "calculate_reverse_gold",

                {
                    target:
                        "LABOR_PERCENT",

                    finalPrice:
                        reverseLabor.finalPrice,

                    weight:
                        reverseLabor.weight,

                    profitPercent:
                        0,

                    taxPercent:
                        0
                },

                request

            );

        }





        const calculation =

            this.parseGoldCalculationRequest(
                message
            );



        if (calculation) {


            return this.executeGoldCalculation(

                calculation,

                request

            );

        }





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





        return this.executeTool(

            toolName,

            {},

            request

        );


    }





    private async executeGoldCalculation(

        calculation:

            {
                weight: number;
                laborPercent: number;
                profitPercent: number;
                taxPercent: number;
                discount?: number;
            },

        request:

            AIRequest

    ):

        Promise<AILocalToolRouteResult> {


        const marketResult =

            await this.toolExecutionService.executeIfRequired(

                {

                    content:
                        "",

                    toolCalls:

                    [

                        {

                            id:
                                `local-market-${Date.now()}`,

                            name:
                                "get_current_gold_price",

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



        if (
            !marketResult?.success
        ) {

            return {

                handled:
                    true,

                toolName:
                    "calculate_gold_price",

                toolResult:
                    marketResult,

                response:
                    marketResult?.error ??
                    "دریافت قیمت فعلی طلا با خطا مواجه شد."

            };

        }



        const marketData =

            marketResult.data as
                Record<string, unknown> |
                undefined;


        const goldPrice =
            marketData?.price;



        if (
            typeof goldPrice !== "number" ||
            !Number.isFinite(goldPrice) ||
            goldPrice <= 0
        ) {

            return {

                handled:
                    true,

                toolName:
                    "calculate_gold_price",

                toolResult: {

                    success:
                        false,

                    error:
                        "قیمت فعلی طلا معتبر نیست."

                },

                response:
                    "قیمت فعلی طلا معتبر نیست."

            };

        }



        const calculationResult =

            await this.toolExecutionService.executeIfRequired(

                {

                    content:
                        "",

                    toolCalls:

                    [

                        {

                            id:
                                `local-calculation-${Date.now()}`,

                            name:
                                "calculate_gold_price",

                            arguments:
                            {

                                weight:
                                    calculation.weight,

                                goldPrice,

                                laborPercent:
                                    calculation.laborPercent,

                                profitPercent:
                                    calculation.profitPercent,

                                taxPercent:
                                    calculation.taxPercent,

                                discount:
                                    calculation.discount

                            }

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



        if (!calculationResult) {

            return {

                handled:
                    true,

                toolName:
                    "calculate_gold_price",

                response:
                    "متأسفانه محاسبه قیمت انجام نشد."

            };

        }



        return {

            handled:
                true,

            toolName:
                "calculate_gold_price",

            toolResult:
                calculationResult,

            response:
                this.buildResponse(
                    "calculate_gold_price",
                    calculationResult
                )

        };

    }





    private async executeTool(

        toolName:

            string,

        args:

            Record<string, unknown>,

        request:

            AIRequest

    ):

        Promise<AILocalToolRouteResult> {



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

                                args

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





    private parseGoldCalculationRequest(

        message:

            string

    ):

        {
            weight: number;
            laborPercent: number;
            profitPercent: number;
            taxPercent: number;
            discount?: number;
        } | null {


        const hasCalculationIntent =

            /(حساب|محاسبه|فاکتور|بگیرم|بخرم|بخر|بشه|باید بشه)/i.test(
                message
            );


        const hasLabor =

            /(اجرت|کارمزد)/i.test(
                message
            );


        if (
            !hasCalculationIntent ||
            !hasLabor
        ) {

            return null;

        }


        const weightMatch =

            message.match(

                /(\d+(?:[.,]\d+)?)\s*(?:گرم|گرمی)/

            );


        const laborMatch =

            message.match(

                /(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)/

            );


        if (
            !weightMatch ||
            !laborMatch
        ) {

            return null;

        }


        const weight =

            Number(
                weightMatch[1].replace(",", ".")
            );


        const laborPercent =

            Number(
                laborMatch[1].replace(",", ".")
            );


        if (
            !Number.isFinite(weight) ||
            weight <= 0 ||
            !Number.isFinite(laborPercent) ||
            laborPercent < 0
        ) {

            return null;

        }


        const profitMatch =

            message.match(

                /(?:سود)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)/

            );


        const taxMatch =

            message.match(

                /(?:مالیات)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)/

            );


        const discountMatch =

            message.match(

                /(?:تخفیف)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)/

            );


        return {

            weight,

            laborPercent,

            profitPercent:
                profitMatch
                    ? Number(profitMatch[1].replace(",", "."))
                    : 0,

            taxPercent:
                taxMatch
                    ? Number(taxMatch[1].replace(",", "."))
                    : 0,

            ...(discountMatch
                ? {
                    discount:
                        Number(
                            discountMatch[1].replace(",", ".")
                        )
                }
                : {})

        };

    }





    private parseReverseLaborRequest(

        message:

            string

    ):

        {
            weight: number;
            finalPrice: number;
        } | null {



        const hasLaborIntent =

            /(اجرت|کارمزد)/i.test(
                message
            );



        if (!hasLaborIntent) {

            return null;

        }



        const weightMatch =

            message.match(

                /(\d+(?:[.,]\d+)?)\s*گرم/

            );



        if (!weightMatch) {

            return null;

        }



        const priceMatch =

            message.match(

                /(\d{5,})/

            );



        if (!priceMatch) {

            return null;

        }



        const weight =

            Number(
                weightMatch[1].replace(",", ".")
            );



        const finalPrice =

            Number(
                priceMatch[1]
            );



        if (

            !Number.isFinite(weight) ||

            weight <= 0 ||

            !Number.isFinite(finalPrice) ||

            finalPrice <= 0

        ) {

            return null;

        }



        return {

            weight,

            finalPrice

        };


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

                "دریافت نتیجه با خطا مواجه شد."

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

                data?.mithqalPrice;



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





        if (

            toolName ===

            "calculate_gold_price"

        ) {


            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const total =
                data?.total;


            if (
                typeof total === "number"
            ) {

                return (
                    `قیمت نهایی: ${this.formatNumber(total)} تومان`
                );

            }

        }





        if (

            toolName ===

            "calculate_reverse_gold"

        ) {


            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const laborPercent =

                data?.laborPercent;



            const laborAmount =

                data?.laborAmount;



            const goldPrice =

                data?.goldPrice;



            const weight =

                data?.weight;



            const finalPrice =

                data?.finalPrice;



            const lines: string[] = [];



            if (

                typeof laborPercent === "number"

            ) {

                lines.push(
                    `اجرت تقریبی: ${this.formatNumber(laborPercent)}٪`
                );

            }



            if (

                typeof laborAmount === "number"

            ) {

                lines.push(
                    `مبلغ اجرت: ${this.formatNumber(laborAmount)} تومان`
                );

            }



            if (

                typeof goldPrice === "number"

            ) {

                lines.push(
                    `قیمت مبنا (۱۸ عیار): ${this.formatNumber(goldPrice)} تومان`
                );

            }



            if (

                typeof weight === "number" &&

                typeof finalPrice === "number"

            ) {

                lines.push(
                    `برای ${this.formatNumber(weight)} گرم با مبلغ پرداختی ${this.formatNumber(finalPrice)} تومان`
                );

            }



            if (lines.length > 0) {

                return lines.join("\n");

            }


        }





        return (

            "اطلاعات دریافت شد."

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

                /[۰-۹]/g,

                digit =>
                    String(
                        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
                    )

            )

            .replace(

                /[٠-٩]/g,

                digit =>
                    String(
                        "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
                    )

            )

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
