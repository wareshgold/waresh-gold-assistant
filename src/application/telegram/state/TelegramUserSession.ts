export interface TelegramUserSession {


    userId: string;


    state: string;


    data: Record<string, unknown>;


    navigationStack?: string[];


    updatedAt: number;


}