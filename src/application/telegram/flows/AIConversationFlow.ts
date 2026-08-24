import {
    TelegramConversationFlow
}
from "./TelegramConversationFlow";

import {
    AIService
}
from "../../ai/services/AIService";


export const AI_CHAT_STATE = "AI_CHAT";


export class AIConversationFlow

implements TelegramConversationFlow {


    constructor(

        private readonly aiService:

            AIService

    ) {}



    canHandle(

        state:

            string

    ): boolean {

        return state === AI_CHAT_STATE;

    }



    async execute(

        userId:

            string,

        message:

            string,

        context?: {

            userName?: string;

        }

    ): Promise<{

        type: "text";

        content: string;

        metadata?: Record<string, unknown>;

    }> {

        const result =

            await this.aiService.process({

                message,

                userId,

                userName: context?.userName

            });

        return {

            type: "text",

            content: result.content

        };

    }

}