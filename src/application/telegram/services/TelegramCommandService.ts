import {
    TelegramCommandExecutor,
    TelegramExecutorResponse
}
from "../interfaces/TelegramCommandExecutor";


import {
    TelegramCommandRouter
}
from "../commands/TelegramCommandRouter";


import {
    TelegramCommandContextBuilder
}
from "../commands/TelegramCommandContextBuilder";


import {
    IncomingMessage
}
from "../../common/models/IncomingMessage";


import {
    TelegramConversationManager
}
from "../flows/TelegramConversationManager";


import {
    TelegramAISessionManager
}
from "../ai/TelegramAISessionManager";



export class TelegramCommandService

implements TelegramCommandExecutor {



    private readonly contextBuilder:

        TelegramCommandContextBuilder;



    constructor(

        private readonly router:

            TelegramCommandRouter,

        private readonly conversationManager?:

            TelegramConversationManager,

        contextBuilder?:

            TelegramCommandContextBuilder,

        private readonly aiSessionManager?:

            TelegramAISessionManager

    ) {

        this.contextBuilder =

            contextBuilder ??

            new TelegramCommandContextBuilder();

    }



    async execute(

        message:
            IncomingMessage | string

    ):
        Promise<TelegramExecutorResponse> {

        const normalizedMessage:
            IncomingMessage =

            typeof message === "string"

                ? {

                    userId:
                        "default",

                    text:
                        message

                }

                :
                message;


        console.log(
            "INCOMING MESSAGE:",
            normalizedMessage
        );


        const text =
            normalizedMessage.text.trim();

        const normalizedText =
            text.toLowerCase();


        if (
            normalizedText === "/cancel" ||
            normalizedText === "/reset" ||
            normalizedText === "cancel" ||
            normalizedText === "reset" ||
            normalizedText === "لغو" ||
            normalizedText === "انصراف"
        ) {

            if (this.conversationManager) {

                await this.conversationManager.cancel(
                    normalizedMessage.userId
                );

            }

            return {
                type:
                    "text",

                content:
                    "جلسه فعلی لغو شد. از اینجا به بعد می‌تونی دستور یا سؤال جدیدت رو بفرستی."
            };

        }


        const resolvedCommand =
            this.router.resolveCommand(text);

        const navigationHandler =
            this.router
                .getHandlers()
                .find(
                    handler =>
                        handler.canHandle(resolvedCommand)
                );

        const isReplyKeyboardNavigation =
            resolvedCommand !== normalizedText &&
            Boolean(navigationHandler);

        const isMenuCommand = resolvedCommand.startsWith("menu:");

        if (isReplyKeyboardNavigation || isMenuCommand) {

            if (isMenuCommand && this.conversationManager) {
                await this.conversationManager.cancel(
                    normalizedMessage.userId
                );
            }

            const context =
                this.contextBuilder.build(
                    resolvedCommand,
                    normalizedMessage.userId,
                    [],
                    normalizedMessage.username,
                    normalizedMessage.firstName
                );

            return this.router.execute(
                context
            );
        }


        if (
            text.startsWith("/")
        ) {

            const context =
                this.contextBuilder.build(
                    text,
                    normalizedMessage.userId,
                    [],
                    normalizedMessage.username,
                    normalizedMessage.firstName
                );

            return this.router.execute(
                context
            );

        }


        if (
            this.aiSessionManager
        ) {

            const aiResponse =
                await this.aiSessionManager.execute(
                    normalizedMessage.userId,
                    text
                );

            if (
                aiResponse
            ) {

                return aiResponse;

            }

        }


        if (
            this.conversationManager
        ) {

            const activeConversation =
                await this.conversationManager.execute(
                    normalizedMessage.userId,
                    text,
                    {
                        userName: normalizedMessage.firstName ?? normalizedMessage.username
                    }
                );

            if (
                activeConversation
            ) {

                return activeConversation;

            }

        }


        const fallbackCommand =
            this.router.resolveCommand(text);

        const context =
            this.contextBuilder.build(
                fallbackCommand,
                normalizedMessage.userId,
                [],
                normalizedMessage.username,
                normalizedMessage.firstName
            );

        return this.router.execute(
            context
        );

    }



}