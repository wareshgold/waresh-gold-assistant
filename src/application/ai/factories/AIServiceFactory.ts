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
    GetStrategyASignalTool
}
from "../tools/market/GetStrategyASignalTool";


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
    StrategyAStrategyService
}
from "../../strategy/strategy-a/StrategyAStrategyService";





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



    strategy-aStrategyService:

        StrategyAStrategyService;



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

        new GetStrategyASignalTool(

            dependencies.strategy-aStrategyService

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