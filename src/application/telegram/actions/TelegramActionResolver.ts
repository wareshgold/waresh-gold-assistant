export interface TelegramActionResolver {


    resolve(

        actionId: string

    ): string | undefined;


}