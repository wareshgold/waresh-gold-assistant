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
    GetCurrentGoldMithqalPriceTool
}
from "../../application/ai/tools/market/GetCurrentGoldMithqalPriceTool";


import {
    CalculateGoldPriceTool
}
from "../../application/ai/tools/gold/CalculateGoldPriceTool";


import {
    CalculateGoldFormulaTool
}
from "../../application/ai/tools/gold/CalculateGoldFormulaTool";


import {
    CalculateReverseGoldTool
}
from "../../application/ai/tools/gold/CalculateReverseGoldTool";


import {
    CalculateInvoiceTool
}
from "../../application/ai/tools/gold/CalculateInvoiceTool";


import {
    GetCurrentGoldPriceUseCase
}
from "../../application/gold/GetCurrentGoldPriceUseCase";


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


import {
    AIConversationMemory
}
from "../../application/ai/memory/AIConversationMemory";





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



        calculateGoldPriceUseCase:

            CalculateGoldPriceUseCase;



        calculateGoldFormulaUseCase:

            CalculateGoldFormulaUseCase;



        calculateReverseGoldUseCase:

            CalculateReverseGoldUseCase;



        calculateInvoiceUseCase:

            CalculateInvoiceUseCase;



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







    const toolRegistry =

        new DefaultAIToolRegistry();








    toolRegistry.register(

        new GetCurrentGoldPriceTool(

            dependencies.getCurrentGoldPriceUseCase

        )

    );


    toolRegistry.register(

        new GetCurrentGoldMithqalPriceTool(

            dependencies.getCurrentGoldPriceUseCase

        )

    );






    toolRegistry.register(

        new CalculateGoldPriceTool(

            dependencies.calculateGoldPriceUseCase

        )

    );







    toolRegistry.register(

        new CalculateGoldFormulaTool(

            dependencies.calculateGoldFormulaUseCase

        )

    );







    toolRegistry.register(

        new CalculateReverseGoldTool(

            dependencies.calculateReverseGoldUseCase

        )

    );







    toolRegistry.register(

        new CalculateInvoiceTool(

            dependencies.calculateInvoiceUseCase

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

            toolExecutionService,

            undefined,

            dependencies.aiConversationMemory

        );







    return {


        aiService


    };



}