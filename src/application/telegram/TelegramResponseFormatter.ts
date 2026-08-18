import {
    TelegramCommandResponse
}
from "./commands/TelegramCommandHandler";




export class TelegramResponseFormatter {



    constructor(

        _legacyFormatter?: unknown

    ) {}






    format(

        response:
            TelegramCommandResponse | string

    ): string {



        const content =

            typeof response === "string"

                ? response

                : response.content;





        return this.formatForTelegramHtml(

            content

        );


    }







    private formatForTelegramHtml(

        text:
            string

    ): string {



        const protectedBlocks: string[] = [];





        const protectedText =

            text.replace(

                /<code>[\s\S]*?<\/code>/gi,

                match => {



                    const index =

                        protectedBlocks.length;





                    const letter =

                        String.fromCharCode(

                            65 + index

                        );





                    protectedBlocks.push(

                        match

                    );





                    return `__CODE_BLOCK_${letter}__`;


                }

            );








        const escapedText =

            protectedText

                .replace(

                    /&/g,

                    "&amp;"

                )

                .replace(

                    /</g,

                    "&lt;"

                )

                .replace(

                    />/g,

                    "&gt;"

                );








        const formattedText =

            escapedText.replace(

                /[0-9۰-۹][0-9۰-۹,٬]*/g,

                value => {



                    const normalizedValue =

                        this.normalizeDigits(

                            value

                        );





                    return `<code>${normalizedValue}</code>`;


                }

            );








        return formattedText.replace(

            /__CODE_BLOCK_([A-Z]+)__/g,

            (_, letter) => {



                return protectedBlocks[

                    letter.charCodeAt(0) - 65

                ];


            }

        );


    }








    private normalizeDigits(

        value:
            string

    ): string {



        const persianDigits =

            "۰۱۲۳۴۵۶۷۸۹";



        const englishDigits =

            "0123456789";





        let result =

            value;





        for (

            let i = 0;

            i < persianDigits.length;

            i++

        ) {



            result =

                result.replace(

                    new RegExp(

                        persianDigits[i],

                        "g"

                    ),

                    englishDigits[i]

                );


        }






        return result.replace(

            /[٬,]/g,

            ""

        );


    }



}