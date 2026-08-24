import { AppEnv } from "../shared/config/env";
import { createStorageModule } from "./factories/createStorageModule";
import { createCacheModule } from "./factories/createCacheModule";
import { createMarketModule } from "./factories/createMarketModule";
import { createGoldModule } from "./factories/createGoldModule";
import { createStrategyAModule } from "./factories/createStrategyAModule";
import { createVipModule } from "./factories/createVipModule";
import { createTelegramModule } from "./factories/createTelegramModule";
import { createMonitoringModule } from "./factories/createMonitoringModule";
import { createAIModule } from "./factories/createAIModule";
import { GetCurrentMarketPriceUseCase } from "../application/market/GetCurrentMarketPriceUseCase";
import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";
import { GetGoldBubbleUseCase } from "../application/market/GetGoldBubbleUseCase";
import { GetGoldBubbleDataUseCase } from "../application/market/GetGoldBubbleDataUseCase";
import { GetMarketAnalyticsUseCase } from "../application/market/GetMarketAnalyticsUseCase";
import { GetMarketHistoryUseCase } from "../application/market/GetMarketHistoryUseCase";
import { GetCurrentGoldPriceUseCase } from "../application/gold/GetCurrentGoldPriceUseCase";
import { DefaultGoldPriceResolver } from "../application/gold/pricing/GoldPriceResolver";
import { GetMarketChartUseCase } from "../application/market/GetMarketChartUseCase";
import { RefreshMarketPriceUseCase } from "../application/market/RefreshMarketPriceUseCase";
import { RefreshMarketPriceJob } from "../application/jobs/RefreshMarketPriceJob";
import { GetSystemMetricsUseCase } from "../application/system/GetSystemMetricsUseCase";
import { SystemMetricsController } from "../interfaces/http/SystemMetricsController";
import { HealthCheckService } from "../application/system/HealthCheckService";
import { SaveGoldCalculationHistoryUseCase } from "../application/gold/SaveGoldCalculationHistoryUseCase";
import { GetGoldCalculationHistoryUseCase } from "../application/gold/GetGoldCalculationHistoryUseCase";
import { EvaluateAndPublishStrategyASignalUseCase } from "../application/strategy/strategy-a/EvaluateAndPublishStrategyASignalUseCase";
import { StrategyASignalSchedulerJob } from "../application/jobs/StrategyASignalSchedulerJob";
import { SignalMonitorJob } from "../application/jobs/SignalMonitorJob";
import { MonitorSignalLevelsUseCase } from "../application/strategy/strategy-a/MonitorSignalLevelsUseCase";
import { TelegramStrategyASignalNotifier } from "../infrastructure/strategy-a/TelegramStrategyASignalNotifier";
import { TelegramSignalLevelNotifier } from "../infrastructure/strategy-a/TelegramSignalLevelNotifier";
import { StrategyASignalMessageFormatter } from "../application/telegram/presentation/StrategyASignalMessageFormatter";
import { IngestOunceTickFromTextUseCase } from "../application/strategy-a/IngestOunceTickFromTextUseCase";
import { D1GoldPriceAlertRepository } from "../infrastructure/gold-alert/D1GoldPriceAlertRepository";
import { GoldPriceAlertService } from "../application/gold-alert/GoldPriceAlertService";
import { GoldPriceAlertSchedulerJob } from "../application/jobs/GoldPriceAlertSchedulerJob";
import { TelegramGoldPriceAlertNotifier } from "../infrastructure/gold-alert/TelegramGoldPriceAlertNotifier";
import { D1MarketReportPreferenceRepository } from "../infrastructure/market-report/D1MarketReportPreferenceRepository";
import { MarketReportService } from "../application/market-report/MarketReportService";
import { MarketReportSchedulerJob } from "../application/jobs/MarketReportSchedulerJob";
import { TelegramMarketReportNotifier } from "../infrastructure/market-report/TelegramMarketReportNotifier";

export function createContainer(env: AppEnv) {
    const storage = createStorageModule(env);
    const cache = createCacheModule(env);
    const monitoring = createMonitoringModule(env);

    const healthCheckService = new HealthCheckService(cache.cache, storage.snapshotRepository, monitoring.metricsStore);
    const market = createMarketModule(env, storage, cache, monitoring);
    const gold = createGoldModule();
    const strategyA = createStrategyAModule(env);
    const vip = createVipModule(env);

    const ingestOunceTickFromTextUseCase = new IngestOunceTickFromTextUseCase(strategyA.tickRepository);
    const saveGoldCalculationHistoryUseCase = new SaveGoldCalculationHistoryUseCase(storage.goldCalculationHistoryRepository);
    const getGoldCalculationHistoryUseCase = new GetGoldCalculationHistoryUseCase(storage.goldCalculationHistoryRepository);
    const getSystemMetricsUseCase = new GetSystemMetricsUseCase(monitoring.monitoringService);
    const systemMetricsController = new SystemMetricsController(getSystemMetricsUseCase);

    const currentMarketPriceUseCase = new GetCurrentMarketPriceUseCase(market.cachedMarketProvider);
    const getCurrentGoldPriceUseCase = new GetCurrentGoldPriceUseCase(market.cachedMarketProvider);
    const getGoldBubbleUseCase = new GetGoldBubbleUseCase(market.cachedMarketProvider, gold.goldBubbleCalculator);

    const ai = createAIModule(env, {
        getCurrentGoldPriceUseCase,
        getGoldBubbleUseCase,
        calculateGoldPriceUseCase: gold.calculateGoldPriceUseCase,
        calculateGoldFormulaUseCase: gold.calculateGoldFormulaUseCase,
        calculateReverseGoldUseCase: gold.calculateReverseGoldUseCase,
        calculateInvoiceUseCase: gold.calculateInvoiceUseCase,
        strategyAStrategyService: strategyA.strategyService,
        aiConversationMemory: storage.aiConversationMemory
    });

    const goldPriceResolver = new DefaultGoldPriceResolver(getCurrentGoldPriceUseCase);
    const getGoldPriceUseCase = new GetGoldPriceUseCase(currentMarketPriceUseCase);
    const getGoldBubbleDataUseCase = new GetGoldBubbleDataUseCase(market.cachedMarketProvider, gold.goldBubbleCalculator);
    const getMarketAnalyticsUseCase = new GetMarketAnalyticsUseCase(market.analyticsFacade);
    const getMarketHistoryUseCase = new GetMarketHistoryUseCase(market.snapshotService);
    const getMarketChartUseCase = new GetMarketChartUseCase(market.marketChartService);
    const refreshMarketPriceUseCase = new RefreshMarketPriceUseCase(market.priceRefreshService);
    const refreshMarketPriceJob = new RefreshMarketPriceJob(refreshMarketPriceUseCase);

    const goldPriceAlertService = new GoldPriceAlertService(new D1GoldPriceAlertRepository(env.waresh_gold_db));
    const marketReportService = new MarketReportService(new D1MarketReportPreferenceRepository(env.waresh_gold_db));

    const telegram = createTelegramModule(env, {
        getGoldPriceUseCase,
        getGoldBubbleUseCase,
        getMarketAnalyticsUseCase,
        getMarketHistoryUseCase,
        getGoldCalculationHistoryUseCase,
        getMarketChartUseCase,
        calculateGoldFormulaUseCase: gold.calculateGoldFormulaUseCase,
        calculateReverseGoldUseCase: gold.calculateReverseGoldUseCase,
        goldCalculationWorkflow: gold.goldCalculationWorkflow,
        sessionStore: storage.sessionStore,
        profileStore: storage.userProfileStore,
        goldPriceResolver,
        saveGoldCalculationHistoryUseCase,
        aiService: ai.aiService,
        vipAccessService: vip.vipAccessService,
        strategyService: strategyA.strategyService,
        ingestOunceTickFromTextUseCase,
        goldPriceAlertService,
        marketReportService,
        calculateInvoiceUseCase: gold.calculateInvoiceUseCase
    });

    const evaluateAndPublishStrategyASignalUseCase = new EvaluateAndPublishStrategyASignalUseCase(
        strategyA.strategyService,
        vip.vipAccessService,
        new TelegramStrategyASignalNotifier(telegram.telegramBotClient, new StrategyASignalMessageFormatter())
    );
    const strategyASignalSchedulerJob = new StrategyASignalSchedulerJob(evaluateAndPublishStrategyASignalUseCase);

    const signalLevelNotifier = new TelegramSignalLevelNotifier(telegram.telegramBotClient);
    const monitorSignalLevelsUseCase = new MonitorSignalLevelsUseCase(
        strategyA.signalRepository,
        {
            getCurrentPrice: async (symbol: string) => {
                const price = await getCurrentGoldPriceUseCase.execute();
                return price.price;
            }
        },
        signalLevelNotifier,
        async () => {
            const vipUsers = await vip.vipAccessService.listActiveUsers("STRATEGY_A_SIGNALS" as any);
            return vipUsers.map(u => u.telegramUserId);
        },
        24
    );
    const signalMonitorJob = new SignalMonitorJob(monitorSignalLevelsUseCase);

    const goldPriceAlertSchedulerJob = new GoldPriceAlertSchedulerJob(
        goldPriceAlertService,
        market.cachedMarketProvider,
        new TelegramGoldPriceAlertNotifier(telegram.telegramBotClient)
    );
    const marketReportSchedulerJob = new MarketReportSchedulerJob(
        marketReportService,
        market.cachedMarketProvider,
        getGoldBubbleDataUseCase,
        getMarketAnalyticsUseCase,
        new TelegramMarketReportNotifier(telegram.telegramBotClient)
    );

    return {
        ...cache,
        ...market,
        ...gold,
        ...strategyA,
        ...vip,
        ...telegram,
        ...monitoring,
        ...ai,
        systemMetricsController,
        healthCheckService,
        getSystemMetricsUseCase,
        getGoldPriceUseCase,
        getGoldBubbleUseCase,
        getCurrentGoldPriceUseCase,
        goldPriceResolver,
        getGoldBubbleDataUseCase,
        getMarketAnalyticsUseCase,
        getMarketHistoryUseCase,
        getMarketChartUseCase,
        refreshMarketPriceUseCase,
        refreshMarketPriceJob,
        saveGoldCalculationHistoryUseCase,
        getGoldCalculationHistoryUseCase,
        ingestOunceTickFromTextUseCase,
        evaluateAndPublishStrategyASignalUseCase,
        strategyASignalSchedulerJob,
        signalMonitorJob,
        goldPriceAlertService,
        goldPriceAlertSchedulerJob,
        marketReportService,
        marketReportSchedulerJob
    };
}
