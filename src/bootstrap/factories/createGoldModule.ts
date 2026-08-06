import { GoldBubbleCalculator }
from "../../domain/market/services/GoldBubbleCalculator";


import { CalculateGoldFormulaUseCase }
from "../../application/gold/CalculateGoldFormulaUseCase";


import { CalculateReverseGoldUseCase }
from "../../application/gold/CalculateReverseGoldUseCase";


import { ReverseGoldCalculator }
from "../../domain/gold/calculator/ReverseGoldCalculator";


import { createGoldRuleEngine }
from "../../domain/gold/services/createGoldRuleEngine";


import { GoldCalculationWorkflow }
from "../../application/gold/workflows/GoldCalculationWorkflow";


import { GoldCalculationValidator }
from "../../application/gold/validation/GoldCalculationValidator";


import { GoldCalculationHistoryManager }
from "../../application/gold/workflows/GoldCalculationHistoryManager";





export interface GoldModule {



    calculateGoldFormulaUseCase:
        CalculateGoldFormulaUseCase;



    calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;



    goldBubbleCalculator:
        GoldBubbleCalculator;



    goldCalculationWorkflow:
        GoldCalculationWorkflow;



}








export function createGoldModule()
: GoldModule {



    const goldRuleEngine =

        createGoldRuleEngine();







    const calculateGoldFormulaUseCase =

        new CalculateGoldFormulaUseCase(

            goldRuleEngine

        );








    const calculateReverseGoldUseCase =

        new CalculateReverseGoldUseCase(

            new ReverseGoldCalculator()

        );









    const goldBubbleCalculator =

        new GoldBubbleCalculator();








    const goldCalculationHistoryManager =

        new GoldCalculationHistoryManager();








    const goldCalculationWorkflow =

        new GoldCalculationWorkflow(

            calculateGoldFormulaUseCase,

            new GoldCalculationValidator(),

            goldCalculationHistoryManager

        );








    return {



        calculateGoldFormulaUseCase,


        calculateReverseGoldUseCase,


        goldBubbleCalculator,


        goldCalculationWorkflow



    };



}