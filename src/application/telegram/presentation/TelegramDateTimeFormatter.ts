export class TelegramDateTimeFormatter {
    format(date = new Date()): string {
        return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
            timeZone: "Asia/Tehran",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(date);
    }
}
