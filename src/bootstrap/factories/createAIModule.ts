import {
    AIService
}
from "../../application/ai/services/AIService";


import {
    NvidiaAIClient
}
from "../../infrastructure/ai/providers/NvidiaAIClient";


import {
    AppEnv
}
from "../../shared/config/env";


import {
    DefaultAIToolRegistry
}
from "../../application/ai/tools/DefaultAIToolRegistry";


import {
    GetCurrentGoldPriceTool
}
from "../../application/ai/tools/market/GetCurrentGoldPriceTool";


import {
    GetCurrentGoldPriceUseCase
}
from "../../application/gold/GetCurrentGoldPriceUseCase";


import {
    AIToolExecutor
}
from "../../application/ai/tools/AIToolExecutor";


import {
    AIToolDecisionService
}
from "../../application/ai/services/AIToolDecisionService";


import {
    AIToolExecutionService
}
from "../../application/ai/services/AIToolExecutionService";





export interface AIModule {


    aiService:

        AIService;



}







export function createAIModule(

    env: AppEnv,

    dependencies:
    {
        getCurrentGoldPriceUseCase:
            GetCurrentGoldPriceUseCase;
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








    const toolRegistry =

        new DefaultAIToolRegistry();







    toolRegistry.register(

        new GetCurrentGoldPriceTool(

            dependencies.getCurrentGoldPriceUseCase

        )

    );







    const toolExecutor =

        new AIToolExecutor(

            toolRegistry

        );








    const toolExecutionService =

        new AIToolExecutionService(

            new AIToolDecisionService(),

            toolExecutor

        );









    const aiService =

        new AIService(

            aiClient,

            toolRegistry,

            toolExecutionService

        );







    return {


        aiService


    };


}