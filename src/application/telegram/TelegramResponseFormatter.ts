import {
    TelegramCommandResponse
} from "./commands/TelegramCommandHandler";

export class TelegramResponseFormatter {

    constructor(
        _legacyFormatter?: unknown
    ) {}

    format(
        response: TelegramCommandResponse | string
    ): string {
        const content =
            typeof response === "string"
                ? response
                : response.content;

        return this.formatForTelegramHtml(content);
    }

    private formatForTelegramHtml(
        text: string
    ): string {
        if (this.containsTelegramHtml(text)) {
            return this.normalizeDigitsOnly(text);
        }

        const formattedText = text.replace(
            /[0-9۰-۹][0-9۰-۹,٬]*/g,
            value => `<code>${this.normalizeDigits(value)}</code>`
        );

        return formattedText;
    }

    private containsTelegramHtml(
        text: string
    ): boolean {
        return /<\/?(?:b|strong|i|em|u|ins|s|strike|del|code|pre|blockquote)(?:\s[^>]*)?>/i.test(text);
    }

    private normalizeDigitsOnly(
        text: string
    ): string {
        return text;
    }

    private normalizeDigits(
        value: string
    ): string {
        const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
        const englishDigits = "0123456789";

        let result = value;

        for (let i = 0; i < persianDigits.length; i++) {
            result = result.replace(
                new RegExp(persianDigits[i], "g"),
                englishDigits[i]
            );
        }

        return result.replace(/[٬,]/g, "");
    }
}
