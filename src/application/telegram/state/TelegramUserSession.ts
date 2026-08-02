export interface TelegramUserSession<
    TData = Record<string, unknown>
> {


    userId: string;


    state: string;


    data: TData;


    navigationStack?: string[];


    updatedAt: number;


}