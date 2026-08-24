import { WelcomeMessageProvider }
from "./WelcomeMessageProvider";

export class RandomWelcomeMessageProvider

implements WelcomeMessageProvider {

    private readonly firstTimeMessages = [
        (name: string) =>
`🌟 سی ${name} خوش اومدی! وارش گلد خوشحالم داری 👋

من دستیار هوشمند طلای تو هستم!
اینجا می‌تونی:

💰 قیمت لحظه‌ای طلا و ارز رو ببینی
📊 بازار رو تحلیل کنی
🧮 قیمت خرید و فروش رو حساب کنی
🫧 حباب بازار رو بررسی کنی

بیا بریم 👇`,

        (name: string) =>
`✨ ${name} جان! خوش اومدی به وارش گلد 🌷

وارش گلد اینجاست که کمکت کنه
بازار طلا رو بهتر بشناسی.

💎 قیمت لحظه‌ای طلا
📈 تحلیل و روند بازار
🧮 محاسبات دقیق طلا
🔍 بررسی حباب

از منوی زیر شروع کن 👇`,

        (name: string) =>
`💰 ${name} عزیز! سی خوش اومدی به وارش گلد 🙌

اینجا دستیار هوشمند طلای تو هستم
که هر لحظه اطلاعات بازار رو
برات آماده می‌کنه.

🟡 قیمت لحظه‌ای
📊 تحلیل بازار
🧮 محاسبه قیمت
🫧 بررسی حباب

بیا بریم 👇`,

        (name: string) =>
`🌸 ${name} جان! خوش اومدی به وارش گلد 💖

اینجا فقط قیمت نیست؛
یه دستیار هوشمنده که کمکت می‌کنه
بهترین تصمیم رو بگیری.

💎 قیمت لحظه‌ای و ارز
📊 تحلیل و روند بازار
🧮 محاسبه خرید و فروش
🔍 حباب و فرصت خرید

بیا شروع کنیم 👇`,

        (name: string) =>
`🌟 ${name} خوش اومدی! 👋

وارش گلد دستیار هوشمند طلای توئه.

💰 قیمت لحظه‌ای طلا و ارز
📊 تحلیل بازار و حباب
🧮 محاسبه دقیق قیمت طلا
🔔 اعلان قیمت و هشدار

بیا بریم 👇`
    ];

    private readonly returningMessages = [
        (name: string) =>
`👋 سی ${name} خوش برگشتی! خوشحالم داری 💖

دستیار هوشمند طلای تو فعاله و منتظرته.

بازار طلا چطوره؟ بیا ببینیم 👇`,

        (name: string) =>
`✨ ${name} عزیز! دوباره سلام! 🌷

خوشحالم که برگشتی.
اطلاعات لحظه‌ای بازار طلا در دسترس توئه.

بیا ببینیم امروز چه خبره 👇`,

        (name: string) =>
`🌟 ${name} جان! برگشتی! چه خوب 🙌

دستیار هوشمند وارش گلد همیشه آماده‌ست.

بیا بریم 👇`,

        (name: string) =>
`💰 ${name} سی خوش اومدی دوباره! 👋

بازار طلا همیشه در حال تغییره.
بذار ببینیم امروز چه خبره!

از منوی زیر شروع کن 👇`,

        (name: string) =>
`👋 ${name} سلام دوباره! 💙

وارش گلد کنار توئه.
هر سوالی درباره طلا داری بپرس.

بیا بریم 👇`
    ];

    getWelcomeMessage(
        firstName?: string,
        username?: string,
        returning?: boolean
    ): string {
        const messages = returning
            ? this.returningMessages
            : this.firstTimeMessages;

        const index = Math.floor(Math.random() * messages.length);
        const name = firstName ?? username ?? "دوست عزیز";

        return messages[index](name);
    }
}
