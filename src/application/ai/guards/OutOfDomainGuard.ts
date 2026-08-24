export class OutOfDomainGuard {    private readonly inDomainSignals = [

        "طلا",

        "زر",

        "مثقال",

        "عیار",

        "گرم",

        "انس",

        "اجرت",

        "سود",

        "مالیات",

        "تخفیف",

        "فاکتور",

        "صورتحساب",

        "بابل",

        "حباب",

        "بازار",

        "نرخ",

        "قیمت",

        "محاسبه",

        "فرمول",

        "معکوس",

        "خرید",

        "فروش",

        "سکه",

        "شمش",

        "جواهر",

        "آبشده",

        "آب شده",

        "میلیون",

        "تومان",

        "انس",

        "۱۸",

        "18",

        "۲۴",

        "24",

        "یونیت",

        "تاریخچه محاسبه",

        "تحلیل بازار",

        "تاریخ",

        "امروز",

        "دیروز",

        "فردا",

        "ساعت",

        "چندم",

        "چندمی",

        "چه روزی",

        "تقویم"

    ];


    private readonly outOfDomainSignals = [

        "هوا",
        "دما",
        "درجه",
        "باران",
        "برف",
        "آب و هوا",
        "هواشناسی",
        "فوتبال",
        "بازی",
        "گل زد",
        "لیگ",
        "تیم",
        "ورزش",
        "آشپزی",
        "غذا",
        "دستور پخت",
        "سیاست",
        "انتخابات",
        "رئیس جمهور",
        "دولت",
        "ارز دیجیتال",
        "بیت کوین",
        "بیت‌کوین",
        "اتریوم",
        "کریپتو",
        "سهام",
        "بورس تهران",
        "فیلم",
        "سریال",
        "آهنگ",
        "موسیقی",
        "جوک",
        "طنز",
        "پزشکی",
        "دارو",
        "بیماری",
        "مسافرت",
        "بلیط",
        "هتل"

    ];


    private readonly rejectionMessage = `
من دستیار تخصصی طلا و بازار وارش گلد هستم و فقط در این زمینه‌ها می‌تونم کمکت کنم:

🟡 قیمت طلا و مثقال
🧮 محاسبات و فاکتور طلا
📊 تحلیل و حباب بازار

سوال‌های خارج از این حوزه رو پوشش نمی‌دم.
اگر در مورد طلا سوالی داری بپرس.
`.trim();


    handle(
        message: string
    ):
        string | null {


        const normalized =
            this.normalize(
                message
            );


        if (!normalized) {

            return null;

        }


        const hasInDomain =
            this.inDomainSignals.some(
                signal =>
                    normalized.includes(
                        signal
                    )
            );


        if (hasInDomain) {

            return null;

        }


        const hasOutOfDomain =
            this.outOfDomainSignals.some(
                signal =>
                    normalized.includes(
                        signal
                    )
            );


        if (hasOutOfDomain) {

            return this.rejectionMessage;

        }


        return null;

    }


    private normalize(
        message: string
    ):
        string {


        return message
            .trim()
            .toLowerCase()
            .replace(
                /ي/g,
                "ی"
            )
            .replace(
                /ك/g,
                "ک"
            )
            .replace(
                /ۀ/g,
                "ه"
            )
            .replace(
                /\s+/g,
                " "
            );

    }


}