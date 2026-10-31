import { AIToolExecutionService } from "./AIToolExecutionService";
import { AIToolResult } from "../tools/AIToolResult";
import { AIRequest } from "../models/AIRequest";
import { GetCurrentGoldPriceUseCase } from "../../gold/GetCurrentGoldPriceUseCase";
import { CalculateGoldPriceUseCase } from "../../gold/CalculateGoldPriceUseCase";
import { formatWithCommas } from "../../../shared/utils/number";

export interface AILocalToolRouteResult {
    handled: boolean;
    toolName?: string;
    toolResult?: AIToolResult;
    response?: string;
}

/**
 * AILocalToolRouter
 * 
 * Routes common queries to local handlers WITHOUT calling NVIDIA AI.
 * This makes the bot faster (2-3 seconds vs 30-60 seconds).
 * 
 * Priority: Handle 80% of queries locally, only send complex ones to AI.
 */
export class AILocalToolRouter {

    constructor(
        private readonly toolExecutionService: AIToolExecutionService,
        private readonly goldPriceUseCase?: GetCurrentGoldPriceUseCase,
        private readonly calculateGoldPriceUseCase?: CalculateGoldPriceUseCase
    ) {}

    async route(request: AIRequest): Promise<AILocalToolRouteResult> {
        const message = this.normalize(request.message);

        // 1. Try gold calculation (weight + labor)
        const calculation = this.parseGoldCalculationRequest(message);
        if (calculation) {
            return this.executeGoldCalculation(calculation, request);
        }

        // 2. Try reverse labor calculation
        const reverseLabor = this.parseReverseLaborRequest(message);
        if (reverseLabor) {
            return this.executeTool(
                "calculate_reverse_gold",
                {
                    target: "LABOR_PERCENT",
                    finalPrice: reverseLabor.finalPrice,
                    weight: reverseLabor.weight,
                    profitPercent: 0,
                    taxPercent: 0
                },
                request
            );
        }

        // 3. Try date/time requests
        const dateTimeResponse = this.handleDateTimeRequest(message);
        if (dateTimeResponse) {
            return { handled: true, response: dateTimeResponse };
        }

        // 4. Try ounce price (fast path)
        if (this.isOuncePriceRequest(message) && this.goldPriceUseCase) {
            const result = await this.goldPriceUseCase.execute();
            const lines: string[] = [];
            if (result.ouncePrice && result.ouncePrice > 0) {
                lines.push(`🌎 انس جهانی: ${this.formatNumber(result.ouncePrice)} دلار`);
            } else {
                lines.push(`🌎 انس جهانی: ناموجود`);
            }
            if (result.dollarPrice && result.dollarPrice > 0) {
                lines.push(`💵 دلار: ${this.formatNumber(result.dollarPrice)} تومان`);
            }
            if (result.price && result.price > 0) {
                lines.push(`🟡 طلای ۱۸ عیار: ${this.formatNumber(result.price)} تومان`);
            }
            return {
                handled: true,
                toolName: "get_current_ounce_price",
                response: lines.length > 0 ? lines.join("\n") : "قیمت انس در دسترس نیست."
            };
        }

        // 5. Try dollar price
        if (this.isDollarPriceRequest(message) && this.goldPriceUseCase) {
            const result = await this.goldPriceUseCase.execute();
            if (result.dollarPrice && result.dollarPrice > 0) {
                return {
                    handled: true,
                    toolName: "get_dollar_price",
                    response: `💵 قیمت دلار: ${this.formatNumber(result.dollarPrice)} تومان`
                };
            }
            return {
                handled: true,
                toolName: "get_dollar_price",
                response: "قیمت دلار در دسترس نیست."
            };
        }

        // 6. Try coin price
        if (this.isCoinPriceRequest(message) && this.goldPriceUseCase) {
            const result = await this.goldPriceUseCase.execute();
            if (result.price && result.price > 0) {
                // Estimate coin price (roughly 4x gold price for full coin)
                const coinPrice = result.price * 4;
                return {
                    handled: true,
                    toolName: "get_coin_price",
                    response: [
                        `🪙 قیمت تقریبی سکه تمام: ${this.formatNumber(coinPrice)} تومان`,
                        ``,
                        `💡 قیمت سکه وابسته به عوامل مختلفی مثل عرضه و تقاضا هست.`,
                        `برای قیمت دقیق سکه، بازار را بررسی کنید.`
                    ].join("\n")
                };
            }
        }

        // 7. Try market analysis request
        if (this.isMarketAnalysisRequest(message) && this.goldPriceUseCase) {
            const result = await this.goldPriceUseCase.execute();
            if (result.price && result.price > 0) {
                return {
                    handled: true,
                    toolName: "market_analysis",
                    response: [
                        `📊 <b>تحلیل سریع بازار طلا</b>`,
                        ``,
                        `🟡 طلای ۱۸ عیار: ${this.formatNumber(result.price)} تومان`,
                        result.dollarPrice ? `💵 دلار: ${this.formatNumber(result.dollarPrice)} تومان` : ``,
                        result.ouncePrice ? `🌎 انس: ${this.formatNumber(result.ouncePrice)} دلار` : ``,
                        ``,
                        `💡 برای تحلیل دقیق‌تر از منوی بازار استفاده کنید.`
                    ].filter(Boolean).join("\n")
                };
            }
        }

        // 8. Try bubble request
        if (this.isGoldBubbleRequest(message)) {
            return this.executeTool("get_gold_bubble", {}, request);
        }

        // 9. Try mithqal price
        if (this.isCurrentMithqalPriceRequest(message)) {
            return this.executeTool("get_current_gold_mithqal_price", {}, request);
        }

        // 10. Try current gold price
        if (this.isCurrentGoldPriceRequest(message)) {
            return this.executeTool("get_current_gold_price", {}, request);
        }

        // 11. Try weight explanation
        if (this.isWeightExplanationRequest(message)) {
            return {
                handled: true,
                toolName: "weight_explanation",
                response: [
                    `⚖️ <b>واحدهای وزن طلا</b>`,
                    ``,
                    `• ۱ گرم = ۰.۰۳۲ اونس تروا`,
                    `• ۱ مثقال = ۴.۶۰۸ گرم`,
                    `• ۱ اونس = ۳۱.۱۰۳ گرم`,
                    `• ۱ مثقال = ۰.۱۴۸ اونس`,
                    ``,
                    `💡 طلای ۱۸ عیار = ۷۵٪ طلای خالص`
                ].join("\n")
            };
        }

        // 12. Try karat explanation
        if (this.isKaratExplanationRequest(message)) {
            return {
                handled: true,
                toolName: "karat_explanation",
                response: [
                    `🏅 <b>تفاوت عیارهای طلا</b>`,
                    ``,
                    `• طلای ۱۸ عیار = ۷۵٪ طلای خالص (رایج‌ترین)`,
                    `• طلای ۲۴ عیار = ۹۹.۹٪ طلای خالص (ناب)`,
                    `• طلای ۲۱ عیار = ۸۷.۵٪ طلای خالص`,
                    ``,
                    `💡 طلای ۲۴ عیار برای سرمایه‌گذاری مناسب‌تره.`,
                    `طلای ۱۸ عیار برای زیورآلات استفاده میشه.`
                ].join("\n")
            };
        }

        // 13. Try gold history request
        if (this.isGoldHistoryRequest(message)) {
            return {
                handled: true,
                toolName: "gold_history",
                response: [
                    `📈 <b>تاریخچه قیمت طلا</b>`,
                    ``,
                    `برای مشاهده تاریخچه قیمت طلا از منوی بازار استفاده کنید:`,
                    ``,
                    `🟡 بازار و قیمت‌ها → 📜 تاریخچه قیمت`,
                    ``,
                    `یا از دستور /history استفاده کنید.`
                ].join("\n")
            };
        }

        // 14. Try best time to buy
        if (this.isBestTimeToBuyRequest(message)) {
            return {
                handled: true,
                toolName: "best_time_advice",
                response: [
                    `⏰ <b>بهترین زمان خرید طلا</b>`,
                    ``,
                    `بر اساس تحلیل‌های بازار:`,
                    ``,
                    `• 🌍 ساعت باز شدن لندن (۱۳:۳۰ تهران)`,
                    `• 🌍 ساعت باز شدن نیویورک (۱۷:۳۰ تهران)`,
                    `• 🌍 همپوشانی لندن و نیویورک`,
                    ``,
                    `💡 بهترین زمان خرید بستگی به روند بازار داره.`,
                    `از تحلیل بازار استفاده کنید.`
                ].join("\n")
            };
        }

        // 15. Try gold investment advice
        if (this.isGoldInvestmentRequest(message)) {
            return {
                handled: true,
                toolName: "gold_investment_advice",
                response: [
                    `💰 <b>مشاوره سرمایه‌گذاری طلا</b>`,
                    ``,
                    `⚠️ من یک دستیار هوشمند هستم، نه مشاور مالی.`,
                    ``,
                    `نکات کلی:`,
                    `• طلا به عنوان پوشش تورم شناخته شده`,
                    `• تنوع در سبد سرمایه‌گذاری مهمه`,
                    `• ریسک‌های بازار را در نظر بگیرید`,
                    ``,
                    `💡 برای مشاوره تخصصی با متخصصان مالی مشورت کنید.`
                ].join("\n")
            };
        }

        // Default: not handled locally, go to NVIDIA
        return { handled: false };
    }

    // === Gold Calculation ===

    private async executeGoldCalculation(
        calculation: {
            weight: number;
            laborPercent: number;
            profitPercent: number;
            taxPercent: number;
            discount?: number;
        },
        request: AIRequest
    ): Promise<AILocalToolRouteResult> {
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
                toolResult: { success: true, data: calcResult },
                response: this.buildResponse("calculate_gold_price", { success: true, data: calcResult })
            };
        }

        return { handled: false };
    }

    // === Pattern Matchers ===

    private isDollarPriceRequest(message: string): boolean {
        const hasDollar = /(دلار|ارز|USD|usd)/i.test(message);
        const hasPrice = /(قیمت|نرخ|چنده|چند|چند شده)/i.test(message);
        const hasGold = /(طلا|طلای|زر|انس|مثقال|اجرت|سود|مالیات|تخفیف|فاکتور|حساب|محاسبه)/i.test(message);
        return hasDollar && hasPrice && !hasGold;
    }

    private isCoinPriceRequest(message: string): boolean {
        const hasCoin = /(سکه|سکه تمام|نیم سکه|ربع سکه|سکه بهار)/i.test(message);
        const hasPrice = /(قیمت|نرخ|چنده|چند|چند شده)/i.test(message);
        return hasCoin && hasPrice;
    }

    private isMarketAnalysisRequest(message: string): boolean {
        const hasAnalysis = /(تحلیل|وضعیت|روند|شرایط|وضع بازار)/i.test(message);
        const hasMarket = /(بازار|طلا|market)/i.test(message);
        return hasAnalysis && hasMarket;
    }

    private isWeightExplanationRequest(message: string): boolean {
        const hasWeight = /(وزن|واحد|گرم|مثقال|اونس|انس)/i.test(message);
        const hasExplanation = /(چیه|چیست|چطور|چقدره|چقدر|توضیح|واضح)/i.test(message);
        return hasWeight && hasExplanation;
    }

    private isKaratExplanationRequest(message: string): boolean {
        const hasKarat = /(عیار|کارت|۱۸|۲۴|۲۱|18|24|21)/i.test(message);
        const hasExplanation = /(تفاوت|چیه|چیست|چطور|توضیح|چقدره)/i.test(message);
        return hasKarat && hasExplanation;
    }

    private isGoldHistoryRequest(message: string): boolean {
        const hasHistory = /(تاریخچه|تاریخ|سابقه|گذشته)/i.test(message);
        const hasGold = /(طلا|قیمت)/i.test(message);
        return hasHistory && hasGold;
    }

    private isBestTimeToBuyRequest(message: string): boolean {
        const hasTime = /(بهترین زمان|چه زمانی|کی بخرم|کی بخریم|زمان خرید|وقت خرید)/i.test(message);
        const hasBuy = /(خرید|بخرم|بخریم|سرمایه)/i.test(message);
        return hasTime || hasBuy;
    }

    private isGoldInvestmentRequest(message: string): boolean {
        const hasInvestment = /(سرمایه|سرمایه‌گذاری|invest|investment)/i.test(message);
        const hasGold = /(طلا|gold)/i.test(message);
        return hasInvestment && hasGold;
    }

    // === Existing Pattern Matchers ===

    private isGoldBubbleRequest(message: string): boolean {
        const hasBubble = /(حباب|حبابش|حبابش چقدره|حباب چقدره|حباب چقدر)/i.test(message);
        return hasBubble;
    }

    private isOuncePriceRequest(message: string): boolean {
        const hasOunce = /(انس|اونس|اونج|انس جهانی|انس طلا)/i.test(message);
        return hasOunce;
    }

    private isCurrentGoldPriceRequest(message: string): boolean {
        const hasGold = /(طلا|طلای|زر)/i.test(message);
        const hasPrice = /(قیمت|نرخ|چنده|چند|چند شده|چند است|چند شده)/i.test(message);
        const hasMithqal = /(مثقال|مثقالی)/i.test(message);
        const hasWeight = /(\d+(?:[.,]\d+)?)\s*(گرم|گرم?ی|kg|کیلو)/i.test(message);
        const hasCalculationIntent = /(حساب|محاسبه|فاکتور|اجرت|سود|مالیات|تخفیف|خرید|فروش)/i.test(message);
        return hasGold && hasPrice && !hasMithqal && !hasWeight && !hasCalculationIntent;
    }

    private isCurrentMithqalPriceRequest(message: string): boolean {
        const hasMithqal = /(مثقال|مثقالی)/i.test(message);
        const hasPrice = /(قیمت|نرخ|چنده|چند|چند است|چند شده)/i.test(message);
        return hasMithqal && hasPrice;
    }

    private parseGoldCalculationRequest(message: string): {
        weight: number;
        laborPercent: number;
        profitPercent: number;
        taxPercent: number;
        discount?: number;
    } | null {
        const hasCalculationIntent = /(حساب|محاسبه|فاکتور|بگیرم|بخرم|بخر|بشه|باید بشه|چقدر|چنده|میشه|بشه|چقدره)/i.test(message);
        const hasLabor = /(اجرت|کارمزد|اجرت)/i.test(message);
        const hasWeightAndLabor = /\d+\s*گرم/.test(message) && (/\d+\s*(%|٪|درصد)/.test(message) || /اجرت\s*\d+/.test(message) || /کارمزد\s*\d+/.test(message));

        if (!hasCalculationIntent && !hasWeightAndLabor) return null;
        if (!hasLabor && !hasWeightAndLabor) return null;

        const weightMatch = message.match(/(\d+(?:[.,]\d+)?)\s*(?:گرم|گرمی)/);
        const laborMatch = message.match(/(?:اجرت|کارمزد)\s*(\d+(?:[.,]\d+)?)/) || message.match(/(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)/);

        if (!weightMatch || !laborMatch) return null;

        const weight = Number(weightMatch[1].replace(",", "."));
        const laborPercent = Number(laborMatch[1].replace(",", "."));

        if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(laborPercent) || laborPercent < 0) return null;

        const profitMatch = message.match(/(?:سود)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)?/);
        const taxMatch = message.match(/(?:مالیات)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)?/);
        const discountMatch = message.match(/(?:تخفیف)\s*(?:با|برابر|به)?\s*(\d+(?:[.,]\d+)?)\s*(?:درصد|٪|%)?/);

        return {
            weight,
            laborPercent,
            profitPercent: profitMatch ? Number(profitMatch[1].replace(",", ".")) : 0,
            taxPercent: taxMatch ? Number(taxMatch[1].replace(",", ".")) : 0,
            ...(discountMatch ? { discount: Number(discountMatch[1].replace(",", ".")) } : {})
        };
    }

    private parseReverseLaborRequest(message: string): {
        weight: number;
        finalPrice: number;
    } | null {
        const hasLaborIntent = /(اجرت|کارمزد)/i.test(message);
        if (!hasLaborIntent) return null;

        const weightMatch = message.match(/(\d+(?:[.,]\d+)?)\s*گرم/);
        if (!weightMatch) return null;

        const priceMatch = message.match(/(\d{5,})/);
        if (!priceMatch) return null;

        const weight = Number(weightMatch[1].replace(",", "."));
        const finalPrice = Number(priceMatch[1]);

        if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(finalPrice) || finalPrice <= 0) return null;

        return { weight, finalPrice };
    }

    private handleDateTimeRequest(message: string): string | null {
        const hasGoldDomain = /(طلا|بازار|قیمت|حباب|انس|مثقال|خرید|فروش|تحلیل)/i.test(message);
        if (hasGoldDomain) return null;

        const isTimeRequest = /(ساعت|الان چند|چه ساعتی| ساعت چنده)/i.test(message);
        const isDateRequest = /(تاریخ|چندم|چندمی|چه روزی|تقویم|کدوم روز| امروز چندمه|امروز چندمه)/i.test(message);

        if (!isDateRequest && !isTimeRequest) return null;

        const now = new Date();
        const gregorian = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
        const hours = gregorian.getHours();
        const minutes = gregorian.getMinutes();
        const timeStr = `${hours}:${minutes.toString().padStart(2, "0")}`;

        if (isTimeRequest && isDateRequest) {
            return `الان ساعت ${timeStr} به وقت تهران هست.`;
        }

        if (isTimeRequest) {
            return `الان ساعت ${timeStr} به وقت تهران هست.`;
        }

        const monthNames = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
        return `امروز ${gregorian.getDate()} ${monthNames[gregorian.getMonth()]} ${gregorian.getFullYear()} هست.\nساعت: ${timeStr} به وقت تهران.`;
    }

    // === Tool Execution ===

    private async executeTool(toolName: string, args: Record<string, unknown>, request: AIRequest): Promise<AILocalToolRouteResult> {
        const toolResult = await this.toolExecutionService.executeIfRequired(
            { content: "", toolCalls: [{ id: `local-${Date.now()}`, name: toolName, arguments: args }] },
            { userId: request.userId, metadata: request.context }
        );

        if (!toolResult) {
            return { handled: true, toolName, response: "متأسفانه اجرای ابزار موردنظر انجام نشد." };
        }

        return { handled: true, toolName, toolResult, response: this.buildResponse(toolName, toolResult) };
    }

    private buildResponse(toolName: string, result: AIToolResult): string {
        if (!result.success) return result.error ?? "دریافت نتیجه با خطا مواجه شد.";

        if (toolName === "get_gold_bubble") {
            const data = result.data as Record<string, unknown> | undefined;
            const bubbleAmount = data?.bubbleAmount;
            const bubblePercentage = data?.bubblePercentage;
            if (typeof bubbleAmount === "number") {
                const percentageText = typeof bubblePercentage === "number" ? ` (${this.formatNumber(bubblePercentage)}٪)` : "";
                return `حباب فعلی طلا: ${this.formatNumber(bubbleAmount)} تومان` + percentageText;
            }
            return "مقدار حباب طلا در حال حاضر معتبر نیست.";
        }

        if (toolName === "get_current_gold_price") {
            const data = result.data as Record<string, unknown> | undefined;
            const price = data?.price;
            if (typeof price === "number") {
                const lines = [`💰 <b>قیمت لحظه‌ای طلا</b>`, "", `🟡 طلای ۱۸ عیار: ${this.formatNumber(price)} تومان`];
                const ouncePrice = data?.ouncePrice;
                if (typeof ouncePrice === "number" && ouncePrice > 0) lines.push(`🌎 انس جهانی: ${this.formatNumber(ouncePrice)} دلار`);
                const dollarPrice = data?.dollarPrice;
                if (typeof dollarPrice === "number" && dollarPrice > 0) lines.push(`💵 دلار: ${this.formatNumber(dollarPrice)} تومان`);
                return lines.join("\n");
            }
        }

        if (toolName === "get_current_gold_mithqal_price") {
            const data = result.data as Record<string, unknown> | undefined;
            const price = data?.mithqalPrice;
            if (typeof price === "number") return `قیمت فعلی مثقال طلا: ${this.formatNumber(price)} تومان`;
        }

        if (toolName === "get_current_ounce_price") {
            const data = result.data as Record<string, unknown> | undefined;
            const ouncePrice = data?.ouncePrice ?? data?.price;
            if (typeof ouncePrice === "number" && ouncePrice > 0) {
                const lines = [`🌎 انس جهانی: ${this.formatNumber(ouncePrice)} دلار`];
                const dollarPrice = data?.dollarPrice;
                if (typeof dollarPrice === "number" && dollarPrice > 0) lines.push(`💵 دلار: ${this.formatNumber(dollarPrice)} تومان`);
                const goldPrice = data?.price;
                if (typeof goldPrice === "number" && goldPrice > 0) lines.push(`🟡 طلای ۱۸ عیار: ${this.formatNumber(goldPrice)} تومان`);
                return lines.join("\n");
            }
        }

        if (toolName === "calculate_gold_price") {
            const data = result.data as Record<string, unknown> | undefined;
            const total = data?.total;
            const goldValue = data?.goldValue;
            const laborAmount = data?.laborAmount;
            const profitAmount = data?.profitAmount;
            const taxAmount = data?.taxAmount;
            const weight = data?.weight;

            if (typeof total === "number") {
                const lines: string[] = [];
                if (typeof weight === "number") lines.push(`⚖️ وزن: ${weight} گرم`);
                if (typeof goldValue === "number") lines.push(`🟡 ارزش طلا: ${this.formatNumber(goldValue)} تومان`);
                if (typeof laborAmount === "number" && laborAmount > 0) lines.push(`🛠 اجرت: ${this.formatNumber(laborAmount)} تومان`);
                if (typeof profitAmount === "number" && profitAmount > 0) lines.push(`💹 سود: ${this.formatNumber(profitAmount)} تومان`);
                if (typeof taxAmount === "number" && taxAmount > 0) lines.push(`🧾 مالیات: ${this.formatNumber(taxAmount)} تومان`);
                lines.push("");
                lines.push(`💰 قیمت نهایی: ${this.formatNumber(total)} تومان`);
                return lines.join("\n");
            }
        }

        if (toolName === "calculate_reverse_gold") {
            const data = result.data as Record<string, unknown> | undefined;
            const laborPercent = data?.laborPercent;
            const laborAmount = data?.laborAmount;
            const goldPrice = data?.goldPrice;
            const weight = data?.weight;
            const finalPrice = data?.finalPrice;
            const lines: string[] = [];
            if (typeof laborPercent === "number") lines.push(`اجرت تقریبی: ${this.formatNumber(laborPercent)}٪`);
            if (typeof laborAmount === "number") lines.push(`مبلغ اجرت: ${this.formatNumber(laborAmount)} تومان`);
            if (typeof goldPrice === "number") lines.push(`قیمت مبنا (۱۸ عیار): ${this.formatNumber(goldPrice)} تومان`);
            if (typeof weight === "number" && typeof finalPrice === "number") lines.push(`برای ${this.formatNumber(weight)} گرم با مبلغ پرداختی ${this.formatNumber(finalPrice)} تومان`);
            if (lines.length > 0) return lines.join("\n");
        }

        return "اطلاعات دریافت شد.";
    }

    private formatNumber(value: number): string {
        return formatWithCommas(value);
    }

    private normalize(message: string): string {
        return message
            .trim()
            .toLowerCase()
            .replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
            .replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/ۀ/g, "ه")
            .replace(/\s+/g, " ");
    }
}
