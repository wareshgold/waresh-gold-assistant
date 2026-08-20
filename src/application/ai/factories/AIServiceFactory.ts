import {
    AIClient
}
from "../client/AIClient";


import {
    AIService
}
from "../services/AIService";


import {
    DefaultAIToolRegistry
}
from "../tools/DefaultAIToolRegistry";


import {
    AIToolExecutor
}
from "../tools/AIToolExecutor";


import {
    AIToolDecisionService
}
from "../services/AIToolDecisionService";


import {
    AIToolExecutionService
}
from "../services/AIToolExecutionService";


import {
    AIConversationMemory
}
from "../memory/AIConversationMemory";


import {
    GetCurrentGoldPriceTool
}
from "../tools/market/GetCurrentGoldPriceTool";


import {
    GetCurrentGoldMithqalPriceTool
}
from "../tools/market/GetCurrentGoldMithqalPriceTool";


import {
    GetGoldBubbleTool
}
from "../tools/market/GetGoldBubbleTool";


import {
    GetSP2LSignalTool
}
from "../tools/market/GetSP2LSignalTool";


import {
    CalculateGoldPriceTool
}
from "../tools/gold/CalculateGoldPriceTool";


import {
    CalculateGoldFormulaTool
}
from "../tools/gold/CalculateGoldFormulaTool";


import {
    CalculateReverseGoldTool
}
from "../tools/gold/CalculateReverseGoldTool";


import {
    CalculateInvoiceTool
}
from "../tools/gold/CalculateInvoiceTool";


import {
    GetCurrentGoldPriceUseCase
}
from "../../gold/GetCurrentGoldPriceUseCase";


import {
    GetGoldBubbleUseCase
}
from "../../market/GetGoldBubbleUseCase";


import {
    CalculateGoldPriceUseCase
}
from "../../gold/CalculateGoldPriceUseCase";


import {
    CalculateGoldFormulaUseCase
}
from "../../gold/CalculateGoldFormulaUseCase";


import {
    CalculateReverseGoldUseCase
}
from "../../gold/CalculateReverseGoldUseCase";


import {
    CalculateInvoiceUseCase
}
from "../../gold/CalculateInvoiceUseCase";


import {
    SP2LStrategyService
}
from "../../strategy/sp2l/SP2LStrategyService";





export interface CreateAIServiceFactoryDependencies {


    client:

        AIClient;



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







export function createAIServiceFactory(

    dependencies:

        CreateAIServiceFactoryDependencies

):

AIService {



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

        new GetGoldBubbleTool(

            dependencies.getGoldBubbleUseCase

        )

    );





    toolRegistry.register(

        new GetSP2LSignalTool(

            dependencies.sp2lStrategyService

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

            dependencies.calculateReverseGoldUseCase,

            dependencies.getCurrentGoldPriceUseCase

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







    return new AIService(

        dependencies.client,

        toolRegistry,

        toolExecutionService,

        undefined,

        dependencies.aiConversationMemory

    );


}