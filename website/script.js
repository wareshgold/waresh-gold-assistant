document.addEventListener('DOMContentLoaded', () => {
    renderProducts(PRODUCTS);
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});