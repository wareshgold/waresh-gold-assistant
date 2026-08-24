import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { TelegramCommandContext } from "../TelegramCommandContext";
import { CalculateInvoiceUseCase } from "../../../gold/CalculateInvoiceUseCase";

export class InvoiceCommandHandler implements TelegramCommandHandler {
    constructor(
        private readonly useCase: CalculateInvoiceUseCase
    ) {}

    metadata() {
        return {
            command: "/invoice",
            description: "محاسبه فاکتور طلا"
        };
    }

    canHandle(command: string): boolean {
        return command === "/invoice";
    }

    async execute(context: TelegramCommandContext): Promise<string> {
        if (context.arguments.length === 0) {
            return "❌ فرمت صحیح:\n/invoice مبلغ1 مبلغ2 ...";
        }

        const items = context.arguments.map((value) => ({
            amount: Number(value)
        }));

        if (items.some(item => Number.isNaN(item.amount))) {
            return "❌ مبلغ وارد شده صحیح نیست";
        }

        const result = this.useCase.execute({ items });

        return `🧾 فاکتور\n\nمبلغ کل:\n${result.total}`;
    }
}
