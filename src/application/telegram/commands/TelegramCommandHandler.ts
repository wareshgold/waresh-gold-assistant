export interface TelegramCommandHandler {

    canHandle(
        command: string
    ): boolean;


    execute(
        command: string
    ): Promise<any>;

}