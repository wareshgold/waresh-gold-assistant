import { WelcomeMessageProvider }
from "./WelcomeMessageProvider";



export class RandomWelcomeMessageProvider
implements WelcomeMessageProvider {



    private readonly messages = [


        "سلام رفیق 🌿 به وارش گلد خوش اومدی. خوشحالیم که همره مایی، بریم بازار طلا رو با هم ببینیم.",


        "خوش اومدی به وارش گلد ✨ امیدواریم اینجا جای خوبی برات باشه. هر چی درباره طلا بخوای کنارتیم.",


        "سلام و صد سلام 🌱 وارش گلد در خدمتته. بریم ببینیم امروز بازار طلا چه خبره.",


        "خوش بومِی رفیق 🤍 به وارش گلد. قیمت‌ها و تحلیل بازار همیشه همراهته.",


        "سلام عزیز دل 🌿 وارش گلد خوشحاله که تو رو می‌بینه. بزن بریم سراغ دنیای طلا.",


        "خوش اومدی به جمع وارش گلد ✨ امیدواریم کارت همیشه پُر رونق و جیبت پُر برکت باشه.",


        "سلام رفیق جان 🌱 چه خوب که اومدی. وارش گلد اینجاست تا حساب و کتاب طلا رو راحت‌تر کنه.",


        "خوش بومِی به وارش گلد 🌿 هر سوالی درباره طلا داشتی بپرس، در خدمتیم.",


        "سلام و خوش اومدی 🌸 از امروز وارش گلد همراهته برای قیمت، محاسبه و تحلیل بازار طلا.",


        "درود بر تو رفیق ✨ خوش اومدی به وارش گلد. امیدواریم همیشه معامله‌هات سبز و پُر سود باشه."


    ];



    getWelcomeMessage(

        firstName?: string,

        username?: string

    ): string {



        const index =

            Math.floor(

                Math.random()

                *

                this.messages.length

            );



        const message =

            this.messages[index];



        const name =

            firstName ??

            username;



        if (!name) {

            return message;

        }



        return (

            `${name} جان 🌿\n\n`

            +

            message

        );


    }


}