export class TelegramMessageBuilder {


    build(

        sections: string[]

    ): string {


        return [

            ...sections,

            "",

            "━━━━━━━━━━━━━━",

            "🟡 Waresh Gold Assistant"

        ].join("\n");


    }


}