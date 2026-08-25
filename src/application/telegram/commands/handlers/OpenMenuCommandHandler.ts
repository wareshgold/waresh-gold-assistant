import {
    TelegramCommandHandler,
    TelegramCommandResponse
} from "../TelegramCommandHandler";

import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    TelegramNavigationService
} from "../../navigation/TelegramNavigationService";

import {
    TelegramNavigationMenuId
} from "../../navigation/TelegramNavigationCatalog";

const MENU_COMMANDS: Record<
    string,
    {
        menuId: TelegramNavigationMenuId;
        title: string;
    }
> = {
    "menu:main": {
        menuId: "main",
        title: "🟡 منوی اصلی"
    },
    "menu:market": {
        menuId: "market",
        title: "📊 منوی بازار"
    },
    "menu:calculate": {
        menuId: "calculate",
        title: "🧮 منوی محاسبات"
    },
    "menu:assistant": {
        menuId: "assistant",
        title: "🤖 منوی دستیار"
    },
    "menu:strategy": {
        menuId: "strategy",
        title: "📈 منوی استراتژی"
    },
    "menu:alerts": {
        menuId: "alerts",
        title: "🔔 منوی اعلان‌ها"
    },
    "menu:settings": {
        menuId: "settings",
        title: "⚙️ منوی تنظیمات"
    },
    "menu:strategy": {
        menuId: "strategy",
        title: "📈 منوی استراتژی"
    }
};

export class OpenMenuCommandHandler
    implements TelegramCommandHandler {

    constructor(
        private readonly navigationService: TelegramNavigationService
    ) {}

    canHandle(
        command: string
    ): boolean {
        return Object.prototype.hasOwnProperty.call(
            MENU_COMMANDS,
            command
        );
    }

    async execute(
        context: TelegramCommandContext
    ): Promise<TelegramCommandResponse> {
        const menu =
            MENU_COMMANDS[context.command];

        if (!menu) {
            return {
                type: "text",
                content: "منوی مورد نظر پیدا نشد."
            };
        }

        return {
            type: "text",
            content: menu.title,
            replyMarkup: this.navigationService.getMenu(
                menu.menuId
            )
        };
    }
}