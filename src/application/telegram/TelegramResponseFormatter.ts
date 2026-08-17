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



                    return `___TELEGRAM_CODE_BLOCK_${index}___`;

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

            /___TELEGRAM_CODE_BLOCK_(\d+)___/g,

            (_, index) =>

                codeBlocks[Number(index)]

        );



    }




}