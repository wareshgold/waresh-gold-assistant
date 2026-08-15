import { describe, expect, it } from "vitest";


import { GetGoldCalculationHistoryUseCase }
from "../../../../../src/application/gold/GetGoldCalculationHistoryUseCase";


import { GetGoldCalculationHistoryCommandHandler }
from "../../../../../src/application/telegram/commands/handlers/GetGoldCalculationHistoryCommandHandler";


import { GoldCalculationHistory }
from "../../../../../src/domain/gold/entities/GoldCalculationHistory";


import { GoldCalculationHistoryRepository }
from "../../../../../src/domain/gold/repositories/GoldCalculationHistoryRepository";



describe(
    "GetGoldCalculationHistoryCommandHandler",
    () => {



        class FakeGoldCalculationHistoryRepository
        implements GoldCalculationHistoryRepository {


            public lastUserId?: string;

            public lastLimit?: number;


            constructor(

                private readonly histories:
                    GoldCalculationHistory[]

            ) {}


            async save() {
                return;
            }


            async getByUserId(

                userId: string,

                limit: number

            ) {

                this.lastUserId =
                    userId;

                this.lastLimit =
                    limit;

                return this.histories.slice(
                    0,
                    limit
                );

            }

        }



        const createHandler = (

            histories: GoldCalculationHistory[] = []

        ) => {

            const repository =
                new FakeGoldCalculationHistoryRepository(
                    histories
                );

            const handler =
                new GetGoldCalculationHistoryCommandHandler(
                    new GetGoldCalculationHistoryUseCase(
                        repository
                    )
                );

            return {
                handler,
                repository
            };

        };



        it(
            "should handle calculation history commands",
            () => {

                const { handler } =
                    createHandler();

                expect(
                    handler.canHandle("/calc-history")
                )
                .toBe(true);

                expect(
                    handler.canHandle("تاریخچه محاسبات")
                )
                .toBe(true);

                expect(
                    handler.canHandle("محاسبات من")
                )
                .toBe(true);

            }
        );



        it(
            "should return an empty history message",
            async () => {

                const { handler, repository } =
                    createHandler();

                const response =
                    await handler.execute({
                        command: "/calc-history",
                        arguments: [],
                        userId: "user-1"
                    });

                expect(response.content)
                .toContain(
                    "هنوز هیچ محاسبه‌ای"
                );

                expect(repository.lastUserId)
                .toBe("user-1");

                expect(repository.lastLimit)
                .toBe(10);

            }
        );



        it(
            "should format calculation history entries",
            async () => {

                const createdAt =
                    new Date("2026-08-15T08:00:00Z");

                const { handler, repository } =
                    createHandler([
                        new GoldCalculationHistory(
                            "user-1",
                            {
                                weight: 2.5,
                                goldPrice: 18780155
                            },
                            {
                                goldValue: 46950387.5,
                                labor: 3286527.125,
                                profit: 5023691.4625,
                                tax: 452132.231625,
                                finalPrice: 55712738.319125
                            },
                            createdAt
                        )
                    ]);

                const response =
                    await handler.execute({
                        command: "/calc-history",
                        arguments: ["1"],
                        userId: "user-1"
                    });

                expect(response.content)
                .toContain("📚 تاریخچه محاسبات طلا");

                expect(response.content)
                .toContain("1) 🟡 محاسبه طلا");

                expect(response.content)
                .toContain("⚖️ وزن: ۲٫۵ گرم");

                expect(response.content)
                .toContain("💰 قیمت طلا: ۱۸٬۷۸۰٬۱۵۵");

                expect(response.content)
                .toContain("💵 مبلغ نهایی:");

                expect(repository.lastLimit)
                .toBe(1);

            }
        );

    }
);
