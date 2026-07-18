export interface TelegramCommandExecutor {

    execute(
        command: string
    ): Promise<string>;

}