import { ApplicationResponse } from "../common/models/ApplicationResponse";


export class TelegramResponseFormatter {


    format(
        response: ApplicationResponse
    ): string {

        return response.content;

    }


}