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



        const codeBlocks: string[] = [];





        const protectedText =

            text.replace(

                /<code>[\s\S]*?<\/code>/gi,

                match => {



                    const index =

                        codeBlocks.length;



                    codeBlocks.push(

                        match

                    );



                    /*
                     * IMPORTANT:
                     *
                     * Placeholder must not contain digits.
                     * Number formatter below processes all numbers
                     * and was corrupting placeholders like:
                     *
                     * ___TELEGRAM_CODE_BLOCK_0___
                     *
                     * into:
                     *
                     * ___TELEGRAM_CODE_BLOCK_<code>0</code>___
                     *
                     */

                    return `___TELEGRAM_CODE_BLOCK_${String.fromCharCode(65 + index)}___`;

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

                /\d[\d,]*/g,

                value => {



                    const normalizedValue =

                        value.replace(

                            /,/g,

                            ""

                        );



                    return `<code>${normalizedValue}</code>`;

                }

            );





        return formattedText.replace(

            /___TELEGRAM_CODE_BLOCK_([A-Z]+)___/g,

            (_, letter) =>

                codeBlocks[

                    letter.charCodeAt(0) - 65

                ]

        );



    }




}