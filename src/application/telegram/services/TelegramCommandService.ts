import { TelegramCommandExecutor } 
from "../interfaces/TelegramCommandExecutor";

import { TelegramCommandRouter } 
from "../commands/TelegramCommandRouter";

import { TelegramCommandContextBuilder } 
from "../commands/TelegramCommandContextBuilder";

import { TelegramSessionStore } 
from "../state/TelegramSessionStore";

import { IncomingMessage } 
from "../../common/models/IncomingMessage";



export class TelegramCommandService
implements TelegramCommandExecutor {



    private readonly contextBuilder:
        TelegramCommandContextBuilder;



    constructor(

        private readonly router:
            TelegramCommandRouter,


        private readonly sessionStore:
            TelegramSessionStore,


        contextBuilder?:
            TelegramCommandContextBuilder

    ) {


        this.contextBuilder =
            contextBuilder ??
            new TelegramCommandContextBuilder();

    }



    async execute(

        message: IncomingMessage

    ): Promise<any> {



        const context =
            this.contextBuilder.build(
                message.text,
                message.userId
            );



        return this.router.execute(
            context
        );


    }


}