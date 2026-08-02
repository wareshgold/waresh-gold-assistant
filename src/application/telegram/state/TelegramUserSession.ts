export interface TelegramUserSession<
    TData = Record<string, unknown>,
    TState = string
> {


    userId: string;


    state: TState;


    data: TData;


    navigationStack?: string[];


    updatedAt: number;


}