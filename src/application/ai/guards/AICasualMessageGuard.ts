export class AICasualMessageGuard {


    private readonly greetings = [

        "سلام",

        "سلام علی",

        "سلام خوبی",

        "خوبی",

        "چه خبر",

        "صبح بخیر",

        "عصر بخیر"

    ];





    handle(

        message: string,

        userName?: string

    ):

        string | null {



        const normalized =

            message

                .trim()

                .toLowerCase();





        if (

            this.greetings.includes(

                normalized

            )

        ) {

            const name = userName ?? "دوست عزیز";


            return [

                `سلام ${name} جان 👋`,

                "",

                "من دستیار هوشمند وارش گلد هستم.",

                "",

                "می‌تونم در زمینه:",

                "",

                "🟡 قیمت طلا",

                "🧮 محاسبات طلا",

                "📊 تحلیل بازار",

                "🧾 فاکتور طلا",

                "",

                "کمکت کنم."

            ].join("\n");

        }





        return null;

    }


}