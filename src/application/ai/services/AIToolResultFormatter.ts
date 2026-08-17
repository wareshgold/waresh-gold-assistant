import {
    AIToolResult
}
from "../tools/AIToolResult";



export class AIToolResultFormatter {



    format(

        result:

            AIToolResult

    ):

        string {



        if (!result.success) {


            return `

نتیجه اجرای ابزار ناموفق بود.

خطا:

${result.error ?? "خطای نامشخص"}

پاسخ مناسب و کوتاه به کاربر بده.

`.trim();


        }





        if (

            this.isCurrentGoldPriceResult(

                result.data

            )

        ) {



            return this.formatCurrentGoldPrice(

                result.data

            );


        }





        return `

نتیجه ابزار:

${JSON.stringify(

    result.data,

    null,

    2

)}

این نتیجه را برای کاربر به زبان فارسی و قابل فهم توضیح بده.

`.trim();


    }







    private isCurrentGoldPriceResult(

        data:

            unknown

    ):

        boolean {



        if (

            typeof data !== "object" ||

            data === null

        ) {


            return false;


        }





        return (

            (data as Record<string, unknown>).type ===

            "CURRENT_GOLD_PRICE"

        );


    }







    private formatCurrentGoldPrice(

        data:

            unknown

    ):

        string {



        const value =

            data as Record<string, unknown>;





        return `

نتیجه ابزار دریافت قیمت بازار طلا:

نوع:

طلای ${value.purity ?? 18} عیار


قیمت فعلی:

${this.formatNumber(value.price)} ${value.currency ?? "تومان"}


منبع:

${value.source ?? "بازار"}


این اطلاعات را به زبان فارسی و کوتاه برای کاربر توضیح بده.

`.trim();


    }







    private formatNumber(

        value:

            unknown

    ):

        string {



        if (

            typeof value !== "number"

        ) {


            return String(value ?? "");


        }





        return value.toLocaleString(

            "en-US"

        );


    }


}