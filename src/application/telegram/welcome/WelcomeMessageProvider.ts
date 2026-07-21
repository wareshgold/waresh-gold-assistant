export interface WelcomeMessageProvider {


    getWelcomeMessage(

        firstName?: string,

        username?: string

    ): string;


}