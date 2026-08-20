import {
    AIService
}
from "../../application/ai/services/AIService";


import {
    createAIServiceFactory
}
from "../../application/ai/factories/AIServiceFactory";


import {
    NvidiaAIClient
}
from "../../infrastructure/ai/providers/NvidiaAIClient";


import {
    AppEnv
}
from "../../shared/config/env";


import {
    GetCurrentGoldPriceUseCase
}
from "../../application/gold/GetCurrentGoldPriceUseCase";


import {
    GetGoldBubbleUseCase
}
from "../../application/market/GetGoldBubbleUseCase";


import {
    CalculateGoldPriceUseCase
}
from "../../application/gold/CalculateGoldPriceUseCase";


import {
    CalculateGoldFormulaUseCase
}
from "../../application/gold/CalculateGoldFormulaUseCase";


import {
    CalculateReverseGoldUseCase
}
from "../../application/gold/CalculateReverseGoldUseCase";


import {
    CalculateInvoiceUseCase
}
from "../../application/gold/CalculateInvoiceUseCase";


import {
    AIConversationMemory
}
from "../../application/ai/memory/AIConversationMemory";


import {
    SP2LStrategyService
}
from "../../application/strategy/sp2l/SP2LStrategyService";





export interface AIModule {


    aiService:

        AIService;


}








export function createAIModule(

    env:

        AppEnv,


    dependencies:

    {

        getCurrentGoldPriceUseCase:

            GetCurrentGoldPriceUseCase;



        getGoldBubbleUseCase:

            GetGoldBubbleUseCase;



        calculateGoldPriceUseCase:

            CalculateGoldPriceUseCase;



        calculateGoldFormulaUseCase:

            CalculateGoldFormulaUseCase;



        calculateReverseGoldUseCase:

            CalculateReverseGoldUseCase;



        calculateInvoiceUseCase:

            CalculateInvoiceUseCase;



        sp2lStrategyService:

            SP2LStrategyService;



        aiConversationMemory:

            AIConversationMemory;

    }

):

AIModule {





    const aiClient =

        new NvidiaAIClient(

            env.NVIDIA_API_KEY ?? "",


            env.NVIDIA_API_URL

                ??

            "https://integrate.api.nvidia.com/v1/chat/completions"

        );







    const aiService =

        createAIServiceFactory({

            client:

                aiClient,



            getCurrentGoldPriceUseCase:

                dependencies.getCurrentGoldPriceUseCase,



            getGoldBubbleUseCase:

                dependencies.getGoldBubbleUseCase,



            calculateGoldPriceUseCase:

                dependencies.calculateGoldPriceUseCase,



            calculateGoldFormulaUseCase:

                dependencies.calculateGoldFormulaUseCase,



            calculateReverseGoldUseCase:

                dependencies.calculateReverseGoldUseCase,



            calculateInvoiceUseCase:

                dependencies.calculateInvoiceUseCase,



            sp2lStrategyService:

                dependencies.sp2lStrategyService,



            aiConversationMemory:

                dependencies.aiConversationMemory

        });







    return {

        aiService

    };


}