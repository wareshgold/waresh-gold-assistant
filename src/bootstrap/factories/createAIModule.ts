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





export interface AIModule {


    aiService:

        AIService;



}







export function createAIModule(

    env: AppEnv

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

        new AIService(

            aiClient

        );





    return {


        aiService


    };


}