import { describe, expect, it } from "vitest";

import { TelegramResponseFormatter }
from "../../../src/application/telegram/TelegramResponseFormatter";



describe(
    "TelegramResponseFormatter",
    () => {



        it(
            "should format numeric values as copyable code",
            () => {


                const formatter =
                    new TelegramResponseFormatter();



                const result =
                    formatter.format({

                        type: "text",

                        content:
                            "📊 گزارش هوشمند بازار طلا\n\n💰 قیمت فعلی: 18500000 تومان"

                    });



                expect(result)
                    .toContain(
                        "<code>18500000</code>"
                    );


            }
        );






        it(
            "should preserve analytics text content",
            () => {


                const formatter =
                    new TelegramResponseFormatter();



                const result =
                    formatter.format({

                        type: "text",

                        content:
                            [
                                "📊 گزارش هوشمند بازار طلا",
                                "",
                                "💰 قیمت فعلی: 18500000 تومان",
                                "📈 تغییر: +2.78%",
                                "🔥 وضعیت روند: صعودی 📈"
                            ]
                            .join("\n")

                    });



                expect(result)
                    .toContain(
                        "گزارش هوشمند بازار طلا"
                    );


                expect(result)
                    .toContain(
                        "صعودی"
                    );


                expect(result)
                    .toContain(
                        "<code>18500000</code>"
                    );


            }
        );





        it(
            "should handle plain string response",
            () => {


                const formatter =
                    new TelegramResponseFormatter();



                const result =
                    formatter.format(
                        "قیمت طلا 18500000 تومان"
                    );



                expect(result)
                    .toContain(
                        "<code>18500000</code>"
                    );


            }
        );


    }
);