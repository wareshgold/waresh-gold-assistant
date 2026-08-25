export interface TelegramConversationFlow {

    canHandle(
        state: string
    ): boolean;


    execute(
        userId: string,
        message: string,
        context?: {
            userName?: string;
        }
    ): Promise<{
        type: "text";
        content: string;
        metadata?: Record<string, unknown>;
    }>;

}