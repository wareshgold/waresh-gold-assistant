const GOLD_API_BASE_URL = 'https://waresh-gold-assistant.wareshgold.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(PRODUCTS);
    initGoldTools();
});

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.subcategory || product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-weight">${formatWeight(product.weight)}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    const title = document.getElementById('products-title');

    if (category === 'all') {
        renderProducts(PRODUCTS);
        title.textContent = 'همه محصولات';
    } else {
        const filtered = PRODUCTS.filter(p =>
            p.category === category || p.subcategory === category
        );
        renderProducts(filtered);
        title.textContent = category.replace('-', ' ');
    }

    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function filterByPrice(minMillions, maxMillions) {
    const min = minMillions * 1000000;
    const max = maxMillions * 1000000;
    const filtered = PRODUCTS.filter(p => p.price >= min && p.price <= max);

    renderProducts(filtered);
    document.getElementById('products-title').textContent =
        `هدیه ${minMillions} تا ${maxMillions} میلیون تومان`;
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

function toLatinDigits(value) {
    return String(value)
        .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
        .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
        .replace(/٫/g, '.');
}

function parseNumber(value) {
    const normalized = toLatinDigits(value).replace(/[,\s]/g, '');
    if (normalized === '') return null;
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
}

function formatToman(value) {
    return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(value);
}

async function initGoldTools() {
    const gold18 = document.getElementById('gold18-price');
    const currency = document.getElementById('currency-price');
    const ounce = document.getElementById('ounce-price');
    const bubble = document.getElementById('bubble-price');
    const goldPriceInput = document.getElementById('calc-gold-price');

    try {
        const response = await fetch(`${GOLD_API_BASE_URL}/market/gold-price`, {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error('market price request failed');

        const market = await response.json();

        if (gold18) gold18.textContent = `${formatToman(market.gold18Price)} تومان`;
        if (currency) currency.textContent = `${formatToman(market.currencyPrice)} تومان`;
        if (ounce) ounce.textContent = `${Number(market.ouncePrice).toLocaleString('en-US')} دلار`;
        if (goldPriceInput && market.gold18Price) {
            goldPriceInput.value = market.gold18Price;
        }
    } catch {
        if (gold18) gold18.textContent = 'در دسترس نیست';
        if (currency) currency.textContent = 'در دسترس نیست';
        if (ounce) ounce.textContent = 'در دسترس نیست';
    }

    try {
        const response = await fetch(`${GOLD_API_BASE_URL}/market/gold-bubble`, {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error('bubble request failed');

        const data = await response.json();
        if (bubble) {
            const percentage = typeof data.bubblePercentage === 'number'
                ? ` (${data.bubblePercentage.toFixed(2)}٪)`
                : '';
            bubble.textContent = `${formatToman(data.bubbleAmount)} تومان${percentage}`;
        }
    } catch {
        if (bubble) bubble.textContent = 'در دسترس نیست';
    }

    const form = document.getElementById('gold-calculator-form');
    if (form) form.addEventListener('submit', calculateGoldPrice);
}

async function calculateGoldPrice(event) {
    event.preventDefault();

    const status = document.getElementById('calc-status');
    const result = document.getElementById('calc-result');
    const total = document.getElementById('calc-total');
    const submit = document.getElementById('calc-submit');

    const weight = parseNumber(document.getElementById('calc-weight')?.value);
    const goldPrice = parseNumber(document.getElementById('calc-gold-price')?.value);
    const laborPercent = parseNumber(document.getElementById('calc-labor')?.value);
    const profitPercent = parseNumber(document.getElementById('calc-profit')?.value);
    const taxPercent = parseNumber(document.getElementById('calc-tax')?.value);
    const discount = parseNumber(document.getElementById('calc-discount')?.value);

    if (
        weight === null || weight <= 0 ||
        goldPrice === null || goldPrice <= 0 ||
        laborPercent === null || laborPercent < 0 ||
        profitPercent === null || profitPercent < 0 ||
        taxPercent === null || taxPercent < 0 ||
        (discount !== null && discount < 0)
    ) {
        if (status) status.textContent = 'لطفاً مقادیر معتبر وارد کنید.';
        if (result) result.hidden = true;
        return;
    }

    if (submit) submit.disabled = true;
    if (status) status.textContent = 'در حال محاسبه…';
    if (result) result.hidden = true;

    try {
        const response = await fetch(`${GOLD_API_BASE_URL}/api/v1/calculate/gold-price`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                weight,
                goldPrice,
                laborPercent,
                profitPercent,
                taxPercent,
                ...(discount !== null ? { discount } : {})
            })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || typeof data.total !== 'number') {
            throw new Error(data?.error || 'محاسبه انجام نشد.');
        }

        if (total) total.textContent = `${formatToman(data.total)} تومان`;
        if (result) result.hidden = false;
        if (status) status.textContent = '';
    } catch (error) {
        if (status) status.textContent = error instanceof Error
            ? error.message
            : 'خطا در محاسبه. دوباره تلاش کنید.';
    } finally {
        if (submit) submit.disabled = false;
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
