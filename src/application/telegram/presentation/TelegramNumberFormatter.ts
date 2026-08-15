export class TelegramNumberFormatter {


    format(

        value:
            number

    ): string {


        return new Intl.NumberFormat(

            "fa-IR"

        )
        .format(

            Math.round(value)

        );

    }





    formatCode(

        value:
            number

    ): string {


        return `<code>${this.format(value)}</code>`;

    }





    copyValue(

        value:
            number

    ): string {


        return Math.round(value)

            .toString();

    }





    money(

        value:
            number

    ): string {


        return `${this.formatCode(value)} تومان`;

    }





    weight(

        value:
            number

    ): string {


        return `${value.toFixed(3)} گرم`;

    }


}