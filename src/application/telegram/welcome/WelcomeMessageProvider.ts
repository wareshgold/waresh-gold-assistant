export interface WelcomeMessageProvider {


    getWelcomeMessage(

        firstName?: string,

        username?: string,

        returning?: boolean

    ): string;


}