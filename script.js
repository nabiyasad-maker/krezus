
"use strict";

// ======================================
// 1. NONVOYXONA MAHSULOTLARI
// Narxlarni o'zingizga moslab o'zgartiring
// ======================================

const products = [
    {
        id: 1,
        name: "O'zbek noni",
        price: 5000,
        category: "non",
        description: "An'anaviy usulda tayyorlangan mazali non.",
        tag: "Mashhur",
        image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Patir non",
        price: 8000,
        category: "non",
        description: "Yumshoq, xushbo'y va to'yimli patir.",
        tag: "Tavsiya",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Kulcha non",
        price: 4000,
        category: "non",
        description: "Dasturxon uchun kichik va mazali kulcha.",
        tag: "Yangi",
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Shirin bulochka",
        price: 6000,
        category: "bulochka",
        description: "Choy bilan iste'mol qilish uchun ajoyib.",
        tag: "Mazali",
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Kruassan",
        price: 12000,
        category: "bulochka",
        description: "Qat-qat, mayin va mazali pishiriq.",
        tag: "Sevimli",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Shirin pirog",
        price: 15000,
        category: "shirin",
        description: "Shirin ta'mli, choyga mos pishiriq.",
        tag: "Maxsus",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    }
];

// ======================================
// 2. SOZLAMALAR
// ======================================

// O'zingizning WhatsApp raqamingizni kiriting.
// Faqat davlat kodi va raqam: + yoki bo'sh joysiz.
const WHATSAPP_NUMBER = "998901234567";

// Savatcha
const cart = new Map();

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");

// Narxni so'm formatida chiqarish
function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

// HTML matn xavfsizligini ta'minlash
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// ======================================
// 3. MAHSULOTLARNI EKRANGA CHIQARISH
// ======================================

function renderProducts(category = "all") {
    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >
                <span class="product-tag">
                    ${escapeHTML(product.tag)}
                </span>
            </div>

            <div class="product-info">
                <h3>${escapeHTML(product.name)}</h3>
                <p>${escapeHTML(product.description)}</p>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-add="${product.id}"
                        type="button"
                    >
                        + Savatchaga
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// ======================================
// 4. KATEGORIYALAR FILTRI
// ======================================

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderProducts(button.dataset.filter);
    });
});

// ======================================
// 5. SAVATCHAGA MAHSULOT QO'SHISH
// ======================================

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);
    const product = products.find(item => item.id === id);

    if (!product) return;

    const current = cart.get(id) || 0;
    cart.set(id, current + 1);

    renderCart();

    formMessage.textContent =
        product.name + " savatchaga qo'shildi!";

    // Savatcha joylashgan bo'limga olib borish
    document.getElementById("order").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

// ======================================
// 6. SAVATCHANI YANGILASH
// ======================================

function renderCart() {
    let total = 0;
    let count = 0;

    cart.forEach((quantity, id) => {
        const product = products.find(item => item.id === id);

        if (product) {
            total += product.price * quantity;
            count += quantity;
        }
    });

    cartCount.textContent = count;
    cartTotal.textContent = formatPrice(total);

    if (cart.size === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Savatchangiz hozircha bo\'sh.</p>';
        return;
    }

    cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
        const product = products.find(item => item.id === id);

        return `
            <div class="cart-row">
                <div>
                    <div class="cart-product-name">
                        ${escapeHTML(product.name)}
                    </div>
                    <div class="cart-product-price">
                        ${formatPrice(product.price * quantity)}
                    </div>
                </div>

                <div class="quantity-controls">
                    <button
                        type="button"
                        data-minus="${id}"
                        aria-label="Miqdorni kamaytirish"
                    >−</button>

                    <span>${quantity}</span>

                    <button
                        type="button"
                        data-plus="${id}"
                        aria-label="Miqdorni oshirish"
                    >+</button>
                </div>
            </div>
        `;
    }).join("");
}

// Miqdorni oshirish va kamaytirish
cartItems.addEventListener("click", event => {
    const plusButton = event.target.closest("[data-plus]");
    const minusButton = event.target.closest("[data-minus]");

    if (plusButton) {
        const id = Number(plusButton.dataset.plus);
        cart.set(id, (cart.get(id) || 0) + 1);
        renderCart();
    }

    if (minusButton) {
        const id = Number(minusButton.dataset.minus);
        const quantity = (cart.get(id) || 0) - 1;

        if (quantity <= 0) {
            cart.delete(id);
        } else {
            cart.set(id, quantity);
        }

        renderCart();
    }
});

// ======================================
// 7. BUYURTMA VA WHATSAPP
// ======================================

orderForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.size === 0) {
        formMessage.textContent =
            "Iltimos, avval savatchaga non qo'shing.";
        return;
    }

    const name = document.getElementById("customerName")
        .value.trim();

    const phone = document.getElementById("customerPhone")
        .value.trim();

    const address = document.getElementById("customerAddress")
        .value.trim();

    const note = document.getElementById("orderNote")
        .value.trim();

    if (!name || !phone || !address) {
        formMessage.textContent =
            "Ism, telefon va manzilni to'ldiring.";
        return;
    }

    let total = 0;
    let message = "🥖 BARAKA NON — YANGI BUYURTMA\n\n";

    message += "👤 Ism: " + name + "\n";
    message += "📞 Telefon: " + phone + "\n";
    message += "📍 Manzil: " + address + "\n\n";
    message += "🛒 Buyurtma:\n";

    cart.forEach((quantity, id) => {
        const product = products.find(item => item.id === id);

        if (!product) return;

        const subtotal = product.price * quantity;
        total += subtotal;

        message +=
            "• " + product.name +
            " — " + quantity + " dona" +
            " = " + formatPrice(subtotal) + "\n";
    });

    message += "\n💰 Jami: " + formatPrice(total);

    if (note) {
        message += "\n📝 Izoh: " + note;
    }

    message += "\n\nBuyurtma uchun rahmat!";

    // Raqamni o'zingizning WhatsApp raqamingizga almashtiring.
    const validNumber = /^\d{10,15}$/.test(WHATSAPP_NUMBER);

    if (!validNumber || WHATSAPP_NUMBER === "998901234567") {
        formMessage.textContent =
            "WhatsApp raqamini script.js ichida o'zingiznikiga almashtiring.";
        return;
    }

    const whatsappURL =
        "https://wa.me/" + WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    formMessage.textContent =
        "WhatsApp ochiladi. Buyurtmani yuborishni u yerda tasdiqlang.";
});

// ======================================
// 8. MOBIL MENYU
// ======================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Menyuni yopish" : "Menyuni ochish"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Menyuni ochish");
        menuToggle.textContent = "☰";
    });
});

// ======================================
// 9. YILNI AVTOMATIK CHIQARISH
// ======================================

document.getElementById("year").textContent =
    new Date().getFullYear();

// Sayt ochilganda boshlang'ich ma'lumotlarni chiqarish
renderProducts();
renderCart();
