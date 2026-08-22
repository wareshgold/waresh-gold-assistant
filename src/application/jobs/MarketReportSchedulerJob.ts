import { MarketPriceProvider } from "../../domain/market/providers/MarketPriceProvider";
import { MarketReportService } from "../market-report/MarketReportService";

export interface MarketReportBubbleData {
    bubbleAmount: number;
    bubblePercentage: number;
}

export interface MarketReportAnalyticsData {
    analytics: {
        getChange(): { formatted: string };
        getTrend(): { type: string };
    } | null;
}

export interface MarketReportBubbleUseCase {
    execute(): Promise<MarketReportBubbleData>;
}

export interface MarketReportAnalyticsUseCase {
    execute(): Promise<MarketReportAnalyticsData>;
}

export interface MarketReportData {
    gold18Price: number;
    currencyPrice: number;
    ouncePrice: number | null;
    updatedAt: Date;
    bubbleAmount: number;
    bubblePercentage: number;
    marketChange: string | null;
    marketTrend: string | null;
}

export interface MarketReportNotifier {
    send(userId: string, report: MarketReportData): Promise<void>;
}

export class MarketReportSchedulerJob {
    constructor(
        private readonly reportService: MarketReportService,
        private readonly marketPriceProvider: MarketPriceProvider,
        private readonly bubbleUseCase: MarketReportBubbleUseCase,
        private readonly analyticsUseCase: MarketReportAnalyticsUseCase,
        private readonly notifier: MarketReportNotifier
    ) {}

    async execute(now = new Date()): Promise<void> {
        const reports = await this.reportService.getDueReports(now);
        if (!reports.length) return;

        const [price, bubble, analytics] = await Promise.all([
            this.marketPriceProvider.getCurrentPrice(),
            this.bubbleUseCase.execute(),
            this.analyticsUseCase.execute()
        ]);

        const report: MarketReportData = {
            gold18Price: price.gold18Price,
            currencyPrice: price.currencyPrice,
            ouncePrice: price.ouncePrice,
            updatedAt: price.updatedAt,
            bubbleAmount: bubble.bubbleAmount,
            bubblePercentage: bubble.bubblePercentage,
            marketChange: analytics.analytics?.getChange().formatted ?? null,
            marketTrend: analytics.analytics?.getTrend().type ?? null
        };

        await Promise.all(reports.map(async preference => {
            const claimed = await this.reportService.claimDue(preference, now);
            if (!claimed) return;

            try {
                await this.notifier.send(preference.userId, report);
                await this.reportService.markReported(preference.userId, now);
            } catch (error) {
                await this.reportService.releaseClaim(preference.userId);
                throw error;
            }
        }));
    }
}
