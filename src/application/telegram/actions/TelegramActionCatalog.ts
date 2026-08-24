export interface TelegramActionDefinition {
    id: string;
    command: string;
    enabled?: boolean;
    callbackEnabled?: boolean;
}

export class TelegramActionCatalog {
    private static readonly actions: TelegramActionDefinition[] = [
        { id: "gold.price", command: "/price", callbackEnabled: true },
        { id: "gold.bubble", command: "/bubble", callbackEnabled: true },
        { id: "gold.reverse-labor", command: "/reverse-labor", callbackEnabled: true },
        { id: "market.analytics", command: "/analytics", callbackEnabled: true },
        { id: "market.history", command: "/history", callbackEnabled: true },
        { id: "market.chart", command: "/chart", callbackEnabled: false },
        { id: "calculator.gold-price", command: "/calc", callbackEnabled: true },
        { id: "calculator.invoice", command: "/invoice", callbackEnabled: true },
        { id: "calculator.formula", command: "/formula", callbackEnabled: true },
        { id: "calculator.reverse-labor", command: "/reverse-labor", callbackEnabled: true },
        { id: "calculator.history", command: "/calc-history", callbackEnabled: true },
        { id: "assistant.ai", command: "/ai", callbackEnabled: true },
        { id: "assistant.learn", command: "/help", callbackEnabled: true },
        { id: "assistant.help", command: "/help", callbackEnabled: true },
        { id: "strategy.strategy-a", command: "/strategy-a", callbackEnabled: true },
        { id: "strategy.sp2l", command: "/strategy-a", callbackEnabled: true },
        { id: "alerts.live-price", command: "/price", callbackEnabled: true },
        { id: "alerts.market-analysis", command: "/analytics", callbackEnabled: true },
        { id: "alerts.price-target", command: "/alerts", callbackEnabled: true },
        { id: "alerts.my-alerts", command: "/alerts", callbackEnabled: true },
        { id: "settings.alerts", command: "/alerts", callbackEnabled: true },
        { id: "settings.reports", command: "/reports", callbackEnabled: true },
        { id: "settings.account", command: "/help", callbackEnabled: true },
        { id: "settings.bot", command: "/help", callbackEnabled: true },
        { id: "alerts.1h", command: "/alerts 1", callbackEnabled: true },
        { id: "alerts.6h", command: "/alerts 6", callbackEnabled: true },
        { id: "alerts.12h", command: "/alerts 12", callbackEnabled: true },
        { id: "alerts.off", command: "/alerts off", callbackEnabled: true },
        { id: "reports.1h", command: "/reports 1", callbackEnabled: true },
        { id: "reports.6h", command: "/reports 6", callbackEnabled: true },
        { id: "reports.12h", command: "/reports 12", callbackEnabled: true },
        { id: "reports.off", command: "/reports off", callbackEnabled: true }
    ];

    static getAll(): TelegramActionDefinition[] {
        return [...this.actions];
    }

    static getCallbackActions(): TelegramActionDefinition[] {
        return this.actions.filter(
            action => action.callbackEnabled === true
        );
    }

    static find(id: string): TelegramActionDefinition | undefined {
        return this.actions.find(action => action.id === id);
    }
}
