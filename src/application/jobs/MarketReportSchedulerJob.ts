import { MarketPriceProvider } from "../../domain/market/providers/MarketPriceProvider";
import { MarketReportService } from "../market-report/MarketReportService";

export interface MarketReportNotifier {
    send(
        userId: string,
        gold18Price: number,
        currencyPrice: number,
        ouncePrice: number | null,
        updatedAt: Date
    ): Promise<void>;
}

export class MarketReportSchedulerJob {
    constructor(
        private readonly reportService: MarketReportService,
        private readonly marketPriceProvider: MarketPriceProvider,
        private readonly notifier: MarketReportNotifier
    ) {}

    async execute(now = new Date()): Promise<void> {
        const reports = await this.reportService.getDueReports(now);
        if (!reports.length) return;

        const price = await this.marketPriceProvider.getCurrentPrice();

        await Promise.all(reports.map(async report => {
            const claimed = await this.reportService.claimDue(report, now);
            if (!claimed) return;

            try {
                await this.notifier.send(
                    report.userId,
                    price.gold18Price,
                    price.currencyPrice,
                    price.ouncePrice,
                    price.updatedAt
                );
                await this.reportService.markReported(report.userId, now);
            } catch (error) {
                await this.reportService.releaseClaim(report.userId);
                throw error;
            }
        }));
    }
}
