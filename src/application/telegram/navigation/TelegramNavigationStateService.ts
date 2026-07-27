import {
    TelegramSessionStore,
} from "../state/TelegramSessionStore";


import {
    TelegramUserSession,
} from "../state/TelegramUserSession";



export interface TelegramNavigationStateService {


    pushRoute(
        userId: string,
        route: string
    ):
        Promise<void>;



    popRoute(
        userId: string
    ):
        Promise<string | null>;



    getCurrentRoute(
        userId: string
    ):
        Promise<string | null>;



    clear(
        userId: string
    ):
        Promise<void>;

}




export class DefaultTelegramNavigationStateService

implements TelegramNavigationStateService {



    constructor(

        private readonly sessionStore:

            TelegramSessionStore

    ) {}






    async pushRoute(

        userId: string,

        route: string

    ):
        Promise<void> {


        const session =

            await this.getOrCreateSession(userId);



        const stack =

            session.navigationStack
            ?? [];



        if (

            stack[stack.length - 1]
            !== route

        ) {

            stack.push(route);

        }



        session.navigationStack = stack;


        session.state = route;


        session.updatedAt = Date.now();



        await this.sessionStore.save(session);


    }









    async popRoute(

        userId: string

    ):
        Promise<string | null> {


        const session =

            await this.sessionStore.get(userId);



        if (!session) {

            return null;

        }



        const stack =

            session.navigationStack
            ?? [];



        if (stack.length <= 1) {

            return stack[0] ?? null;

        }



        stack.pop();



        const current =

            stack[stack.length - 1]
            ?? null;



        session.navigationStack = stack;


        session.state = current ?? "";


        session.updatedAt = Date.now();



        await this.sessionStore.save(session);



        return current;


    }









    async getCurrentRoute(

        userId: string

    ):
        Promise<string | null> {


        const session =

            await this.sessionStore.get(userId);



        if (!session) {

            return null;

        }



        const stack =

            session.navigationStack
            ?? [];



        return (

            stack[stack.length - 1]
            ??
            session.state
            ??
            null

        );


    }









    async clear(

        userId: string

    ):
        Promise<void> {


        await this.sessionStore.delete(userId);


    }









    private async getOrCreateSession(

        userId: string

    ):
        Promise<TelegramUserSession> {


        const existing =

            await this.sessionStore.get(userId);



        if (existing) {

            return existing;

        }



        return {


            userId,


            state: "",


            data: {},


            navigationStack: [],


            updatedAt: Date.now(),

        };


    }


}