import {
    AIToolExecutionService
} from "./AIToolExecutionService";


import {
    AIToolResult
} from "../tools/AIToolResult";


import {
    AIRequest
} from "../models/AIRequest";


import {
    GetCurrentGoldPriceUseCase
} from "../../gold/GetCurrentGoldPriceUseCase";


import {
    CalculateGoldPriceUseCase
} from "../../gold/CalculateGoldPriceUseCase";



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

            AIToolExecutionService,



        private readonly goldPriceUseCase?:

            GetCurrentGoldPriceUseCase,



        private readonly calculateGoldPriceUseCase?:

            CalculateGoldPriceUseCase

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





        const dateTimeResponse =

            this.handleDateTimeRequest(

                message

            );



        if (dateTimeResponse) {

            return {

                handled: true,

                response: dateTimeResponse

            };

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


    }    private async executeGoldCalculation(

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



        // Fast path: call use cases directly if available

        if (this.goldPriceUseCase && this.calculateGoldPriceUseCase) {

            const priceResult = await this.goldPriceUseCase.execute();

            const goldPrice = priceResult?.price;



            if (!goldPrice || goldPrice <= 0) {

                return {

                    handled: true,

                    toolName: "calculate_gold_price",

                    response: "قیمت فعلی طلا معتبر نیست."

                };

            }



            const calcResult = await this.calculateGoldPriceUseCase.execute({

                weight: calculation.weight,

                goldPrice,

                laborPercent: calculation.laborPercent,

                profitPercent: calculation.profitPercent,

                taxPercent: calculation.taxPercent,

                discount: calculation.discount

            });



            return {

                handled: true,

                toolName: "calculate_gold_price",

                toolResult: {

                    success: true,

                    data: calcResult

                },

                response: this.buildResponse("calculate_gold_price", {

                    success: true,

                    data: calcResult

                })

            };

        }



        // Fallback: go through tool execution service

        const marketResult =

            await this.toolExecutionService.executeIfRequired(

                {

                    content: "",

                    toolCalls: [{

                        id: `local-market-${Date.now()}`,

                        name: "get_current_gold_price",

                        arguments: {}

                    }]

                },

                {

                    userId: request.userId,

                    metadata: request.context

                }

            );



        if (!marketResult?.success) {

            return {

                handled: true,

                toolName: "calculate_gold_price",

                toolResult: marketResult,

                response: marketResult?.error ?? "دریافت قیمت فعلی طلا با خطا مواجه شد."

            };

        }



        const marketData = marketResult.data as Record<string, unknown> | undefined;

        const goldPrice = marketData?.price;



        if (typeof goldPrice !== "number" || !Number.isFinite(goldPrice) || goldPrice <= 0) {

            return {

                handled: true,

                toolName: "calculate_gold_price",

                toolResult: { success: false, error: "قیمت فعلی طلا معتبر نیست." },

                response: "قیمت فعلی طلا معتبر نیست."

            };

        }



        const calculationResult =

            await this.toolExecutionService.executeIfRequired(

                {

                    content: "",

                    toolCalls: [{

                        id: `local-calculation-${Date.now()}`,

                        name: "calculate_gold_price",

                        arguments: {

                            weight: calculation.weight,

                            goldPrice,

                            laborPercent: calculation.laborPercent,

                            profitPercent: calculation.profitPercent,

                            taxPercent: calculation.taxPercent,

                            discount: calculation.discount

                        }

                    }]

                },

                {

                    userId: request.userId,

                    metadata: request.context

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





    private handleDateTimeRequest(

        message:

            string

    ):

        string | null {



        // Only handle pure date/time questions, not market-related ones

        const hasGoldDomain =

            /(طلا|بازار|قیمت|حباب|انس|مثقال|خرید|فروش|تحلیل)/i.test(

                message

            );



        if (hasGoldDomain) {

            return null;

        }



        const isTimeRequest =

            /(ساعت|الان چند|چه ساعتی| ساعت چنده)/i.test(

                message

            );



        const isDateRequest =

            /(تاریخ|چندم|چندمی|چه روزی|تقویم|کدوم روز| امروز چندمه|امروز چندمه)/i.test(

                message

            );



        if (!isDateRequest && !isTimeRequest) {

            return null;

        }



        const now = new Date();



        const gregorian = new Date(

            now.toLocaleString("en-US", {

                timeZone: "Asia/Tehran"

            })

        );



        const hours = gregorian.getHours();

        const minutes = gregorian.getMinutes();

        const timeStr = `${hours}:${minutes.toString().padStart(2, "0")}`;



        if (isTimeRequest && isDateRequest) {

            return `الان ساعت ${timeStr} به وقت تهران هست.`;

        }



        if (isTimeRequest) {

            return `الان ساعت ${timeStr} به وقت تهران هست.`;

        }



        const monthNames = [

            "ژانویه", "فوریه", "مارس", "آوریل",

            "مه", "ژوئن", "ژوئیه", "اوت",

            "سپتامبر", "اکتبر", "نوامبر", "دسامبر"

        ];



        return `امروز ${gregorian.getDate()} ${monthNames[gregorian.getMonth()]} ${gregorian.getFullYear()} هست.\nساعت: ${timeStr} به وقت تهران.`;

    }






    private resolveTool(

        message:

            string

    ):

        string | undefined {



        if (

            this.isGoldBubbleRequest(

                message

            )

        ) {


            return "get_gold_bubble";


        }



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





    private isGoldBubbleRequest(

        message:

            string

    ):

        boolean {



        const hasBubble =

            /(حباب|حبابش|حبابش چقدره|حباب چقدره|حباب چقدر)/i.test(

                message

            );



        return hasBubble;


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
        } | null {        const hasCalculationIntent =

            /(حساب|محاسبه|فاکتور|بگیرم|بخرم|بخر|بشه|باید بشه|چقدر|چنده|میشه|بشه|چقدره)/i.test(

                message

            );



        const hasLabor =

            /(اجرت|کارمزد|اجرت)/i.test(

                message

            );



        // Also match simple patterns like "5 گرم طلا با اجرت 10 درصد"

        const hasWeightAndLabor =

            /\d+\s*گرم/.test(message) && /\d+\s*(%|٪|درصد)/.test(message);



        if (!hasCalculationIntent && !hasWeightAndLabor) {

            return null;

        }



        if (!hasLabor && !hasWeightAndLabor) {

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

            "get_gold_bubble"

        ) {


            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const bubbleAmount =

                data?.bubbleAmount;


            const bubblePercentage =

                data?.bubblePercentage;



            if (

                typeof bubbleAmount ===

                "number"

            ) {


                const percentageText =

                    typeof bubblePercentage ===

                    "number"

                        ? ` (${this.formatNumber(bubblePercentage)}٪)`

                        : "";


                return (

                    `حباب فعلی طلا: ${this.formatNumber(bubbleAmount)} تومان` +
                    percentageText

                );

            }


            return "مقدار حباب طلا در حال حاضر معتبر نیست.";

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

                "number"            ) {



                const lines = [

                    `💰 <b>قیمت لحظه‌ای طلا</b>`,

                    "",

                    `🟡 طلای ۱۸ عیار: ${this.formatNumber(price)} تومان`

                ];



                const ouncePrice = data?.ouncePrice;

                if (typeof ouncePrice === "number" && ouncePrice > 0) {

                    lines.push(`🌎 انس جهانی: ${this.formatNumber(ouncePrice)} دلار`);

                }



                const dollarPrice = data?.dollarPrice;

                if (typeof dollarPrice === "number" && dollarPrice > 0) {

                    lines.push(`💵 دلار: ${this.formatNumber(dollarPrice)} تومان`);

                }



                return lines.join("\n");

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

        }        if (

            toolName ===

            "calculate_gold_price"

        ) {



            const data =

                result.data as

                    Record<string, unknown> |

                    undefined;



            const total = data?.total;

            const goldValue = data?.goldValue;

            const laborAmount = data?.laborAmount;

            const profitAmount = data?.profitAmount;

            const taxAmount = data?.taxAmount;

            const weight = data?.weight;



            if (typeof total === "number") {

                const lines = [

                    `🧮 <b>نتیجه محاسبه طلا</b>`,

                    "",

                    `💰 قیمت نهایی: <b>${this.formatNumber(total)} تومان</b>`,

                    "",

                    "جزئیات:"

                ];



                if (typeof weight === "number") {

                    lines.push(`⚖️ وزن: ${weight} گرم`);

                }

                if (typeof goldValue === "number") {

                    lines.push(`🟡 ارزش طلا: ${this.formatNumber(goldValue)} تومان`);

                }

                if (typeof laborAmount === "number") {

                    lines.push(`🛠 اجرت: ${this.formatNumber(laborAmount)} تومان`);

                }

                if (typeof profitAmount === "number") {

                    lines.push(`💹 سود: ${this.formatNumber(profitAmount)} تومان`);

                }

                if (typeof taxAmount === "number") {

                    lines.push(`🧾 مالیات: ${this.formatNumber(taxAmount)} تومان`);

                }



                return lines.join("\n");

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
