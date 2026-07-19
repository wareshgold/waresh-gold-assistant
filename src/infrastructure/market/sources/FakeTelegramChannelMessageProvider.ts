import {
    MarketMessageProvider
} from "./MarketMessageProvider";



export class FakeTelegramChannelMessageProvider
implements MarketMessageProvider {



    async getLatestMessage():
        Promise<string> {



        return `

🔻طلای ۱۸ عیار: 18,780,155 تومان
(حباب 0.28%)

______________________

🔺دلار تهران: 193,190 تومان
🔻تتر: 193,500 تومان
🔻سکه بهار آزادی: 184,060,000 تومان
🔻سکه امامی: 188,710,000 تومان
🔻نیم سکه: 96,380,000 تومان
🔻ربع سکه: 53,560,000 تومان
🔻اونس طلا: 4,018 دلار
🔻نقره: 51.59 دلار

ساعت: ۱۴:۳۰
تاریخ: ۱۴۰۵/۰۴/۲۸

🆔 @Qeymategold

        `;


    }


}