# Payment Foundation

## هدف

Payment به‌عنوان یک bounded capability مستقل روی Core سفارش پیاده‌سازی شده است. درگاه پرداخت فقط Adapter است و Domain/Application به هیچ درگاه یا Provider مشخصی وابسته نیست.

## جریان

```text
Confirmed Order
      ↓
CreatePaymentUseCase
      ↓
PaymentRepository.save
      ↓
PaymentGateway.initiate
      ↓
Payment(status=initiated, authority)
      ↓
Payment URL
```

تأیید نهایی پرداخت در مرحله بعد از طریق `PaymentGateway.verify` انجام می‌شود و سپس Order lifecycle به‌صورت کنترل‌شده به وضعیت پرداخت‌شده متصل خواهد شد.

## لایه‌ها

- `src/domain/payment/entities/Payment.ts` — وضعیت و مدل پرداخت
- `src/domain/payment/repositories/PaymentRepository.ts` — قرارداد persistence
- `src/domain/payment/gateways/PaymentGateway.ts` — قرارداد درگاه
- `src/application/payment/CreatePaymentUseCase.ts` — orchestration و قواعد application
- `src/infrastructure/payment/MemoryPaymentRepository.ts` — adapter تست/توسعه
- `src/infrastructure/payment/MockPaymentGateway.ts` — gateway تستی
- `migrations/0019_create_payments.sql` — persistence schema

## قواعد فعلی

1. فقط سفارش `confirmed` قابل شروع پرداخت است.
2. مبلغ پرداخت از `Order.total` گرفته می‌شود و از سمت کلاینت دریافت نمی‌شود.
3. برای هر سفارش فقط یک پرداخت فعال وجود دارد.
4. پرداخت موفق دوباره ایجاد نمی‌شود.
5. خطای شروع درگاه، Payment را به `failed` منتقل می‌کند.
6. Domain به ZarinPal، IDPay یا Provider مشخصی وابسته نیست.

## مرحله بعد

- D1 PaymentRepository
- `VerifyPaymentUseCase`
- callback/return boundary
- transition امن `initiated → paid`
- اتصال `paid` به Order lifecycle
- سپس adapter درگاه واقعی

## Validation

Unit testهای `CreatePaymentUseCase` سه مسیر اصلی را پوشش می‌دهند: ایجاد پرداخت، رد سفارش غیرقابل‌پرداخت و جلوگیری از پرداخت فعال تکراری.
