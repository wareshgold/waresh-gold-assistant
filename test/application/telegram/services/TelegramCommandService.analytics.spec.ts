import { describe, it, expect } from "vitest";

import { TelegramCommandService }
from "../../../../src/application/telegram/services/TelegramCommandService";

import { TelegramCommandRegistry }
from "../../../../src/application/telegram/commands/TelegramCommandRegistry";

import { GetGoldPriceUseCase }
from "../../../../src/application/usecases/GetGoldPriceUseCase";

import { GetGoldBubbleUseCase }
from "../../../../src/application/market/GetGoldBubbleUseCase";

import { GetMarketAnalyticsUseCase }
from "../../../../src/application/market/GetMarketAnalyticsUseCase";

import { MarketAnalyticsService }
from "../../../../src/application/market/services/MarketAnalyticsService";

import { MarketSnapshotRepository }
from "../../../../src/domain/market/repositories/MarketSnapshotRepository";

import { MarketSnapshot }
from "../../../../src/domain/market/snapshots/MarketSnapshot";

import { TrendCalculator }
from "../../../../src/domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../../../src/domain/market/analytics/services/VolatilityCalculator";

import { TelegramSessionStore }
from "../../../../src/application/telegram/state/TelegramSessionStore";

import { FakePriceSourceClient }
from "../../../../src/infrastructure/market/clients/FakePriceSourceClient";

import { GoldBubbleCalculator }
from "../../../../src/domain/market/services/GoldBubbleCalculator";

import { MarketPriceProvider }
from "../../../../src/domain/market/providers/MarketPriceProvider";

import { MarketPrice }
from "../../../../src/domain/market/entities/MarketPrice";





class FakeMarketSnapshotRepository
implements MarketSnapshotRepository {


    async save(
        snapshot: MarketSnapshot
    ): Promise<void> {}



    async getLatest():

        Promise<MarketSnapshot | null> {


        return new MarketSnapshot(

            18_500_000,
            180_000,
            3300,
            new Date(),
            "test"

        );

    }




    async getHistory(
        limit: number
    ): Promise<MarketSnapshot[]> {


        return [

            new MarketSnapshot(

                18_500_000,
                180_000,
                3300,
                new Date(),
                "test"

            ),


            new MarketSnapshot(

                18_000_000,
                180_000,
                3300,
                new Date(),
                "test"

            )

        ];

    }


}





class FakeMarketPriceProvider
implements MarketPriceProvider {


    async getCurrentPrice():

        Promise<MarketPrice> {


        return new MarketPrice(

            18_500_000,
            180_000,
            3300,
            new Date()

        );

    }


}





class FakeSessionStore
implements TelegramSessionStore {


    async get(
        userId: string
    ) {

        return null;

    }



    async save(): Promise<void> {}



    async delete(): Promise<void> {}


}







describe(
    "Telegram Analytics Command Flow",
    () => {


        it(
            "should process /analytics command",
            async () => {


                const goldPriceUseCase =

                    new GetGoldPriceUseCase(

                        new FakePriceSourceClient()

                    );





                const bubbleUseCase =

                    new GetGoldBubbleUseCase(

                        new FakeMarketPriceProvider(),

                        new GoldBubbleCalculator()

                    );






                const analyticsService =

                    new MarketAnalyticsService(

                        new FakeMarketSnapshotRepository(),

                        new TrendCalculator(),

                        new VolatilityCalculator()

                    );






                const analyticsUseCase =

                    new GetMarketAnalyticsUseCase(

                        analyticsService

                    );






                const router =

                    TelegramCommandRegistry.create(

                        goldPriceUseCase,

                        bubbleUseCase,

                        analyticsUseCase,

                        {} as any,

                        new FakeSessionStore()

                    );






                const service =

                    new TelegramCommandService(

                        router

                    );






                const response =

                    await service.execute(

                        "/analytics"

                    );







                expect(response.content)

                    .toContain(

                        "📊 گزارش هوشمند بازار طلا"

                    );






                expect(response.content)

                    .toContain(

                        "صعودی"

                    );



            }

        );


    }

);