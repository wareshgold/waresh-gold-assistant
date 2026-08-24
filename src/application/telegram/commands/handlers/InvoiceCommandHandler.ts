import {
    TelegramCommandHandler
} from "../TelegramCommandHandler";

import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    CalculateInvoiceUseCase
} from "../../../gold/CalculateInvoiceUseCase";


export class InvoiceCommandHandler
implements TelegramCommandHandler {


    constructor(
        private readonly calculateInvoiceUseCase:
            CalculateInvoiceUseCase
    ) {}



    metadata() {

        return {

            command:
                "/invoice",

            description:
                "محاسبه فاکتور طلا"

        };

    }



    canHandle(
        command:
            string
    ): boolean {

        const normalized =
            command.trim().toLowerCase();

        return (
            normalized === "/invoice"
            ||
            normalized === "فاکتور"
            ||
            normalized === "محاسبه فاکتور"
        );

    }



    async execute(
        context:
            TelegramCommandContext
    ) {

        return {
            type: "text" as const,
            content: [
                "🧾 <b>محاسبه فاکتور طلا</b>",
                "",
                "برای محاسبه فاکتور، لطفاً از دستیار هوشمند استفاده کنید:",
                "",
                "💬 مثال:",
                "فاکتور ۳ قلم طلا با وزن‌های ۲، ۳ و ۵ گرم",
                "",
                "یا از منوی دستیار هوشمند 🤖 سوال خود را بپرسید."
            ].join("\n")
        };

    }


}
