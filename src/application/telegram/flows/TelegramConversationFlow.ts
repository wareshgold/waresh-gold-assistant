export interface TelegramConversationFlow {

    canHandle(
        state: string
    ): boolean;


    execute(
        userId: string,
        message: string
    ): Promise<{
        type: "text";
        content: string;
        metadata?: Record<string, unknown>;
    }>;

}