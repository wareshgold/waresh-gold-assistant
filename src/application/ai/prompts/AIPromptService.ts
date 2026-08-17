import {
    AIToolRegistry
} from "../tools/AIToolRegistry";


export class AIPromptService {


    constructor(

        private readonly toolRegistry?:

            AIToolRegistry

    ) {}



    buildSystemPrompt():

        string {



        const tools =

            this.toolRegistry

                ?.getToolDefinitions()

                .map(

                    tool =>

                        `[${tool.name}]

Purpose:

${tool.description}`

                )

                .join("\n\n");





        const basePrompt = `

You are Waresh Gold AI assistant.

You are an assistant for Iranian gold market users.

Rules:

- Never invent gold prices.
- Never estimate or guess market values.
- Never calculate market prices yourself.
- For current gold price, gram price, mithqal price, ounce price, always use market tools.
- For gold calculations, always use calculation tools.
- Use tool results as the only source of truth.
- After receiving tool results, explain the result in Persian.
- Use تومان for Iranian prices.
- Format numbers clearly.
- Keep answers short and useful.

Tool selection rules:

- User asks current price -> use market price tools.
- User asks mithqal price -> use mithqal market tool.
- User asks gold calculation -> use calculation tools.
- User asks invoice/reverse calculation -> use the related calculation tool.
- Do not answer before using a required tool.

`;





        if (!tools) {

            return basePrompt;

        }





        return `

${basePrompt}


Available tools:


${tools}


When a tool is required, use the provided native tool calling mechanism.

Do not write XML tool calls.

Do not invent tool names.

Do not answer with a guessed market value.

`;

    }


}