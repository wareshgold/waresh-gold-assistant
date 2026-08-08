import { describe, expect, it } from "vitest";

import { GetMarketAnalyticsCommandHandler }
from "../../../../../src/application/telegram/commands/handlers/GetMarketAnalyticsCommandHandler";

import { GetMarketAnalyticsUseCase }
from "../../../../../src/application/market/GetMarketAnalyticsUseCase";

import { MarketAnalytics }
from "../../../../../src/domain/market/analytics/entities/MarketAnalytics";

import { PercentageChange }
from "../../../../../src/domain/market/analytics/value-objects/PercentageChange";

import {
TrendDirection
}
from "../../../../../src/domain/market/analytics/value-objects/TrendDirection";

import { PriceRange }
from "../../../../../src/domain/market/analytics/value-objects/PriceRange";

import { MarketScore }
from "../../../../../src/domain/market/analytics/value-objects/MarketScore";

import { TelegramMessageBuilder }
from "../../../../../src/application/telegram/presentation/TelegramMessageBuilder";

import { TelegramNumberFormatter }
from "../../../../../src/application/telegram/presentation/TelegramNumberFormatter";

import { MarketAnalyticsMessageFormatter }
from "../../../../../src/application/telegram/presentation/MarketAnalyticsMessageFormatter";



describe(
    "GetMarketAnalyticsCommandHandler",
    () => {



        class FakeGetMarketAnalyticsUseCase
        implements Pick<GetMarketAnalyticsUseCase, "execute"> {



            async execute() {


                const analytics =

                    new MarketAnalytics(

                        18_780_155,

                        18_000_000,

                        PercentageChange.create(

                            18_000_000,

                            18_780_155

                        ),

                        TrendDirection.up(),

                        1.25,

                        PriceRange.create(

                            [

                                18_000_000,

                                18_800_000

                            ]

                        ),

                        new Date(

                            "2026-07-21T09:00:00Z"

                        )

                    );





                return {

                    analytics,

                    score:

                        MarketScore.create(

                            75

                        )

                };

            }

        }





        const createHandler = () => {


            const telegramNumberFormatter =

                new TelegramNumberFormatter();





            const marketAnalyticsMessageFormatter =

                new MarketAnalyticsMessageFormatter(

                    new TelegramMessageBuilder(),

                    telegramNumberFormatter

                );





            return new GetMarketAnalyticsCommandHandler(

                new FakeGetMarketAnalyticsUseCase(),

                marketAnalyticsMessageFormatter

            );

        };





        it(
            "should handle /analytics command",
            () => {


                const handler =
                    createHandler();



                expect(

                    handler.canHandle(
                        "/analytics"
                    )

                )
                .toBe(true);

            }
        );





        it(
            "should handle Persian analytics commands",
            () => {


                const handler =
                    createHandler();



                expect(

                    handler.canHandle(
                        "تحلیل"
                    )

                )
                .toBe(true);





                expect(

                    handler.canHandle(
                        "تحلیل بازار"
                    )

                )
                .toBe(true);

            }
        );





        it(
            "should return analytics response",
            async () => {


                const handler =
                    createHandler();





                const result =

                    await handler.execute(
                        {} as any
                    );





                expect(

                    result.content

                )
                .toContain(
                    "📊 تحلیل بازار طلا"
                );





                expect(

                    result.content

                )
                .toContain(
                    "📈"
                );





                expect(

                    result.content

                )
                .toContain(
                    "حداقل"
                );





                expect(

                    result.content

                )
                .toContain(
                    "حداکثر"
                );

            }
        );

    }

);