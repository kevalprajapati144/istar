// ============================================================
// FitZone - Main JavaScript
// Product catalogue, shopping cart, checkout and form handling
// ============================================================

// ------------------------------------------------------------
// 1. Product catalogue
// ------------------------------------------------------------
const PRODUCTS = [
    {
        id: 'db-01',
        name: 'Hex Dumbbell Set',
        category: 'Strength',
        price: 1499,
        old: 1799,
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
        description: 'A durable pair for everyday strength training.'
    },
    {
        id: 'ym-02',
        name: 'Grip Yoga Mat',
        category: 'Yoga',
        price: 699,
        old: 899,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=85',
        description: 'Comfortable cushioning with a non-slip surface.'
    },
    {
        id: 'kb-03',
        name: 'Cast Iron Kettlebell',
        category: 'Strength',
        price: 1999,
        old: 2299,
        image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85',
        description: 'Build power with a strong, balanced grip.'
    },
    {
        id: 'gg-04',
        name: 'Training Gloves',
        category: 'Accessories',
        price: 499,
        old: 649,
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
        description: 'Comfortable grip and support for lifting sessions.'
    },
    {
        id: 'rb-05',
        name: 'Resistance Band Kit',
        category: 'Accessories',
        price: 799,
        old: 999,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=85',
        description: 'Versatile resistance for home and travel workouts.'
    },
    {
        id: 'sr-06',
        name: 'Speed Skipping Rope',
        category: 'Cardio',
        price: 299,
        old: 399,
        image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85',
        description: 'Lightweight rope for fast cardio sessions.'
    },
    {
        id: 'wb-07',
        name: 'Workout Bench',
        category: 'Strength',
        price: 3499,
        old: 3999,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
        description: 'A stable base for a wide range of exercises.'
    },
    {
        id: 'bf-08',
        name: 'Foam Roller',
        category: 'Recovery',
        price: 599,
        old: 749,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85',
        description: 'Support your warm-up and post-workout recovery.'
    }
];

// ------------------------------------------------------------
// 2. Shared shopping-cart helper functions
// ------------------------------------------------------------

// Format a number as Indian Rupees.
const money = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

// Read the cart from localStorage.
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('fitzoneCart')) || [];
    } catch (error) {
        return [];
    }
}

// Save the cart and refresh the cart counter.
function saveCart(cart) {
    localStorage.setItem('fitzoneCart', JSON.stringify(cart));
    updateCartCount();
}

// Show the total number of products in the navigation bar.
function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.qty, 0);

    document.querySelectorAll('.cart-count').forEach((element) => {
        element.textContent = count;
    });
}

// Add a product to the cart.
function addToCart(id) {
    const cart = getCart();
    const item = cart.find((product) => product.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }

    saveCart(cart);
    showToast('Added to cart', 'Your fitness gear is in the cart.');
}

// Display a Bootstrap toast message.
function showToast(title, message) {
    const toastElement = document.getElementById('liveToast');

    if (!toastElement) {
        return;
    }

    toastElement.querySelector('.toast-title').textContent = title;
    toastElement.querySelector('.toast-body').textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

// Create the HTML card for one product.
function productCard(product) {
    return `
        <div class="col-sm-6 col-lg-3">
            <article class="product-card">
                <div class="position-relative">
                    <img
                        class="product-img"
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >
                    <span class="badge badge-lime position-absolute top-0 start-0 m-3">
                        ${product.category}
                    </span>
                </div>

                <div class="product-body">
                    <h3>${product.name}</h3>
                    <p class="muted small mb-3">${product.description}</p>

                    <div class="d-flex align-items-center justify-content-between gap-2">
                        <div>
                            <span class="price">${money(product.price)}</span>
                            <span class="old-price">${money(product.old)}</span>
                        </div>

                        <button
                            class="btn btn-lime btn-sm"
                            onclick="addToCart('${product.id}')"
                            aria-label="Add ${product.name} to cart"
                        >
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `;
}

// Display featured products on the home page.
function renderFeatured() {
    const target = document.getElementById('featuredProducts');

    if (target) {
        target.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join('');
    }
}

// Display products and apply search/category filters.
function renderProducts() {
    const target = document.getElementById('productGrid');

    if (!target) {
        return;
    }

    const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
    const category = document.getElementById('categoryFilter')?.value || 'All';

    const filteredProducts = PRODUCTS.filter((product) => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(search)
            || product.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    target.innerHTML = filteredProducts.length
        ? filteredProducts.map(productCard).join('')
        : `
            <div class="col-12">
                <div class="empty-state">
                    <div class="icon"><i class="bi bi-search"></i></div>
                    <h3>No products found</h3>
                    <p class="muted">Try another search or category.</p>
                </div>
            </div>
        `;

    const result = document.getElementById('resultCount');

    if (result) {
        result.textContent = `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`;
    }
}

// ------------------------------------------------------------
// 3. Shopping-cart page and quantity controls
// ------------------------------------------------------------

// Render all products currently in the cart.
function renderCart() {
    const root = document.getElementById('cartContent');

    if (!root) {
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        root.innerHTML = `
            <div class="empty-state">
                <div class="icon"><i class="bi bi-bag"></i></div>
                <h2>Your cart is empty</h2>
                <p class="muted">Add something that keeps you moving.</p>
                <a class="btn btn-lime mt-2" href="products.html">Explore products</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;

    const rows = cart.map((item) => {
        const product = PRODUCTS.find((entry) => entry.id === item.id);

        if (!product) {
            return '';
        }

        const total = product.price * item.qty;
        subtotal += total;

        return `
            <div class="cart-row">
                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3 class="h6 fw-bold mb-1">${product.name}</h3>
                    <span class="muted small">${money(product.price)} each</span>
                    <button
                        class="btn btn-link text-danger p-0 d-block small"
                        onclick="removeFromCart('${product.id}')"
                    >
                        Remove
                    </button>
                </div>

                <div class="qty-control">
                    <button onclick="changeQty('${product.id}', -1)" aria-label="Decrease quantity">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${product.id}', 1)" aria-label="Increase quantity">+</button>
                </div>

                <strong class="line-total">${money(total)}</strong>
            </div>
        `;
    }).join('');

    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    root.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="cart-panel">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h2 class="h5 fw-bold mb-0">Your items</h2>
                        <span class="muted small">${itemCount} item(s)</span>
                    </div>
                    ${rows}
                </div>
            </div>

            <div class="col-lg-4">
                <div class="cart-panel">
                    <h2 class="h5 fw-bold mb-4">Order summary</h2>

                    <div class="d-flex justify-content-between mb-3">
                        <span class="muted">Subtotal</span>
                        <strong>${money(subtotal)}</strong>
                    </div>

                    <div class="d-flex justify-content-between mb-3">
                        <span class="muted">Delivery</span>
                        <strong class="text-lime">FREE</strong>
                    </div>

                    <hr style="border-color: var(--line)">

                    <div class="d-flex justify-content-between mb-4">
                        <strong>Total</strong>
                        <strong class="price">${money(subtotal)}</strong>
                    </div>

                    <a href="order.html" class="btn btn-lime w-100">
                        Proceed to checkout <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                    <a href="products.html" class="btn btn-outline-light w-100 mt-2">
                        Continue shopping
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Increase or decrease a product quantity.
function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find((product) => product.id === id);

    if (!item) {
        return;
    }

    item.qty += delta;
    saveCart(cart.filter((product) => product.qty > 0));
    renderCart();
}

// Remove a product from the cart.
function removeFromCart(id) {
    const updatedCart = getCart().filter((product) => product.id !== id);

    saveCart(updatedCart);
    renderCart();
}

// ------------------------------------------------------------
// 4. Checkout summary
// ------------------------------------------------------------

// Display the cart items and total on the checkout page.
function renderCheckout() {
    const summary = document.getElementById('checkoutSummary');

    if (!summary) {
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        summary.innerHTML = `
            <p class="muted mb-0">
                Your cart is empty.
                <a class="text-lime" href="products.html">Browse products</a>.
            </p>
        `;

        const button = document.getElementById('placeOrderBtn');

        if (button) {
            button.disabled = true;
        }

        return;
    }

    let total = 0;

    const summaryItems = cart.map((item) => {
        const product = PRODUCTS.find((entry) => entry.id === item.id);

        if (!product) {
            return '';
        }

        const itemTotal = product.price * item.qty;
        total += itemTotal;

        return `
            <div class="d-flex justify-content-between gap-3 mb-2">
                <span class="muted">${product.name} × ${item.qty}</span>
                <strong>${money(itemTotal)}</strong>
            </div>
        `;
    }).join('');

    summary.innerHTML = `
        ${summaryItems}
        <hr style="border-color: var(--line)">
        <div class="d-flex justify-content-between">
            <strong>Total</strong>
            <strong class="price">${money(total)}</strong>
        </div>
    `;
}

// ------------------------------------------------------------
// 5. Page setup and form validation
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Update shared components on every page.
    updateCartCount();
    renderFeatured();
    renderProducts();
    renderCart();
    renderCheckout();

    // Highlight the active navigation link.
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach((link) => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Connect product search and category filter.
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderProducts);
    }

    // Validate and handle the contact form.
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            document.getElementById('contactSuccess').style.display = 'block';
            contactForm.reset();
        });
    }

    // Validate and handle the demo checkout form.
    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!orderForm.reportValidity()) {
                return;
            }

            const reference = 'FZ' + Math.floor(100000 + Math.random() * 900000);
            const successMessage = document.getElementById('orderSuccess');

            successMessage.innerHTML = `
                <strong>Order request received!</strong><br>
                Your demo order reference is <b>${reference}</b>.
                This college project does not process real payments.
            `;
            successMessage.style.display = 'block';

            localStorage.removeItem('fitzoneCart');
            updateCartCount();
            renderCheckout();
            orderForm.reset();
        });
    }
});
