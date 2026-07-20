export class TelegramResponseFormatter {


    format(
        response: any
    ): string {


        if (typeof response === "string") {

            return response;

        }


        if (
            response?.content
        ) {

            return response.content;

        }


        if (
            response?.type === "text"
        ) {

            return response.content ?? "";

        }


        return "";

    }


}