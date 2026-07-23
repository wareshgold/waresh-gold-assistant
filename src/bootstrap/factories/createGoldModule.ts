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


export interface GoldModule {


    calculateGoldFormulaUseCase:
        CalculateGoldFormulaUseCase;


    calculateReverseGoldUseCase:
        CalculateReverseGoldUseCase;


    goldBubbleCalculator:
        GoldBubbleCalculator;


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



    return {


        calculateGoldFormulaUseCase,


        calculateReverseGoldUseCase,


        goldBubbleCalculator


    };

}