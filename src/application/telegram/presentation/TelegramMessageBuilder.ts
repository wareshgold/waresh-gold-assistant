import { TelegramDateFormatter } from "./TelegramDateFormatter";

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
            "",
            `🕐 ${timestamp}  •  Waresh Gold`
        ].join("\n");
    }
}
