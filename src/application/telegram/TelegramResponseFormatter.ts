export class TelegramResponseFormatter {



    format(
        response: any
    ): string {


        const text =

            typeof response === "string"

                ? response

                : response?.content ??

                  response?.type === "text"

                    ? response.content ?? ""

                    : "";



        return this.formatCopyableNumbers(
            text
        );

    }




    private formatCopyableNumbers(
        text: string
    ): string {


        return text.replace(

            /(?<!\d)(\d{4,})(?!\d)/g,

            (match) => {

                return `<code>${match}</code>`;

            }

        );

    }


}