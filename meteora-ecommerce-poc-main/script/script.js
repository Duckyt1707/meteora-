const openNavbarOnMobile = document.querySelector('.open-navbar-button');

const navbarLinks = document.querySelector('.navbar-links');

const searchBox = document.querySelector('.search-box-container');
const button = document.querySelector('.fa-bars');

openNavbarOnMobile.addEventListener('click', function () {
    navbarLinks.classList.toggle('active');

    searchBox.classList.toggle('active');
    button.classList.toggle('fa-xmark');
});

// Modal produto
const modal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('productModalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');

function openProductModal(cardEl) {
    const img = cardEl.querySelector('img');
    const title = cardEl.querySelector('h3');
    const desc = cardEl.querySelector('p');
    const prices = cardEl.querySelectorAll('h3');
    let priceText = '';
    if (prices.length) priceText = prices[prices.length - 1].textContent;

    modalImage.src = img ? img.src : '';
    modalTitle.textContent = title ? title.textContent : '';
    modalDescription.textContent = desc ? desc.textContent : '';
    modalPrice.textContent = priceText;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.ver-mais').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.card2-1');
        if (card) openProductModal(card);
    });
});

modalClose.addEventListener('click', closeProductModal);
modalBackdrop.addEventListener('click', closeProductModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeProductModal();
});

// Seleção de cores e tamanhos dentro do modal
let selectedColor = null;
let selectedSize = null;

function resetModalSelections() {
    selectedColor = null;
    selectedSize = null;
    document.querySelectorAll('.product-modal .color-dot').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.product-modal .size').forEach(s => s.classList.remove('selected'));
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.product-modal .color-dot')) {
        document.querySelectorAll('.product-modal .color-dot').forEach(d => d.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedColor = getComputedStyle(e.target).backgroundColor;
    }

    if (e.target.matches('.product-modal .size')) {
        document.querySelectorAll('.product-modal .size').forEach(s => s.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSize = e.target.textContent.trim();
    }
});

// Carrinho
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const cartClose = document.getElementById('cartClose');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');

let cart = [];

function loadCart() {
    try {
        const raw = localStorage.getItem('meteora_cart');
        cart = raw ? JSON.parse(raw) : [];
    } catch (err) { cart = []; }
}

function saveCart() {
    localStorage.setItem('meteora_cart', JSON.stringify(cart));
}

function parsePrice(str) {
    if (!str && str !== 0) return 0;
    let s = String(str);
    s = s.replace(/\s/g, '');
    s = s.replace(/R\$|r\$/g, '');
    // remove thousand separators (.) and replace decimal comma with dot
    s = s.replace(/\./g, '');
    s = s.replace(/,/g, '.');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
}

function formatPriceNumber(num) {
    return Number(num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderCart() {
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="info">
                <div class="title">${item.title}</div>
                <div class="meta">${item.color ? 'Cor: ' + item.color : ''} ${item.size ? '• Tamanho: ' + item.size : ''}</div>
                <div class="price">${formatPriceNumber(parsePrice(item.price))}</div>
            </div>
            <button class="remove" data-idx="${idx}">Remover</button>
        `;
        cartItemsEl.appendChild(el);
        const priceNum = parsePrice(item.price);
        total += priceNum;
    });
    cartCountEl.textContent = cart.length;
    cartTotalEl.textContent = formatPriceNumber(total);
    saveCart();
}

cartButton.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
    cartPanel.setAttribute('aria-hidden', cartPanel.classList.contains('open') ? 'false' : 'true');
});
cartClose.addEventListener('click', () => cartPanel.classList.remove('open'));

cartItemsEl.addEventListener('click', (e) => {
    if (e.target.matches('.remove')) {
        const idx = Number(e.target.dataset.idx);
        if (!Number.isNaN(idx)) {
            cart.splice(idx, 1);
            renderCart();
        }
    }
});

// Ao abrir modal, resetar seleções
function openProductModal(cardEl) {
    const img = cardEl.querySelector('img');
    const title = cardEl.querySelector('h3');
    const desc = cardEl.querySelector('p');
    const prices = cardEl.querySelectorAll('h3');
    let priceText = '';
    if (prices.length) priceText = prices[prices.length - 1].textContent;

    modalImage.src = img ? img.src : '';
    modalTitle.textContent = title ? title.textContent : '';
    modalDescription.textContent = desc ? desc.textContent : '';
    modalPrice.textContent = priceText;

    // gerar opções de tamanho conforme o produto
    const modalSizesEl = document.getElementById('modalSizes');
    const modalSectionSize = document.getElementById('modalSectionSize');
    const titleText = title ? title.textContent.trim().toLowerCase() : '';

    modalSizesEl.innerHTML = '';
    // produtos sem opção de tamanho
    if (titleText.includes('bolsa') || titleText.includes('óculos') || titleText.includes('oculos')) {
        modalSectionSize.style.display = 'none';
        selectedSize = null;
    } else {
        modalSectionSize.style.display = '';
        let sizes = ['P', 'PP', 'M', 'G', 'GG'];
        if (titleText.includes('tênis') || titleText.includes('tenis')) {
            // números 35 a 41
            sizes = [];
            for (let s = 35; s <= 41; s++) sizes.push(String(s));
        }
        sizes.forEach(sz => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'size';
            btn.textContent = sz;
            modalSizesEl.appendChild(btn);
        });
    }

    resetModalSelections();

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Adicionar ao carrinho
document.querySelector('.add-bag').addEventListener('click', () => {
    const item = {
        id: Date.now() + '-' + Math.floor(Math.random()*1000),
        title: modalTitle.textContent,
        price: modalPrice.textContent,
        img: modalImage.src,
        color: selectedColor || null,
        size: selectedSize || null,
    };
    cart.push(item);
    renderCart();
    closeProductModal();
    cartPanel.classList.add('open');
});

// init
loadCart();
renderCart();
