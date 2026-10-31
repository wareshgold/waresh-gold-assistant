import { TelegramDateFormatter } from "./TelegramDateFormatter";
import { TelegramFooter } from "./TelegramFooter";

export class TelegramMessageBuilder {
    private readonly dateFormatter: TelegramDateFormatter;

    constructor(dateFormatter?: TelegramDateFormatter) {
        this.dateFormatter = dateFormatter ?? new TelegramDateFormatter();
    }

    build(sections: string[], updatedAt?: Date): string {
        const cleanSections = sections
            .map(section => section.trim())
            .filter(Boolean);

        const timestamp = this.dateFormatter.formatCompact(
            updatedAt ?? new Date()
        );

        return [
            ...cleanSections,
            TelegramFooter.FOOTER_WITH_TIMESTAMP(timestamp)
        ].join("\n");
    }
}
