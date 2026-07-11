// ===== Breesy's Island - Main Script =====

// ===== Cart System =====
let cart = JSON.parse(localStorage.getItem('breesysCart')) || [];

function saveCart() {
    localStorage.setItem('breesysCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = `$${total}`;
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🏝️</div>
                <p>Your island bag is empty.</p>
                <p style="font-size:12px;margin-top:8px;color:#bbb;">Add some gear and start living the island life.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="decrementQty(${index})">−</button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="incrementQty(${index})">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartUI() {
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    saveCart();
    showToast(`${name} added to your bag!`);
    openCart();
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(`${item.name} removed from your bag.`);
}

function incrementQty(index) {
    cart[index].qty += 1;
    saveCart();
}

function decrementQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        removeFromCart(index);
        return;
    }
    saveCart();
}

function clearCart() {
    cart = [];
    saveCart();
    showToast('Bag cleared.');
}

// ===== Cart Drawer =====
function openCart() {
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartDrawer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartDrawer').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Toast Notifications =====
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('active');
    });
    
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

// ===== Navigation =====
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        // Close mobile menu if open
        document.querySelector('.nav-links')?.classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('active');
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 29, 61, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 29, 61, 0.95)';
    }
});

// ===== Hamburger Menu =====
document.querySelector('.hamburger')?.addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-links')?.classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('active');
    }
});

// ===== Category Filtering =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== Newsletter Form =====
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const email = input.value.trim();
    if (email) {
        showToast('Welcome to the island crew! Check your email for 10% off.');
        input.value = '';
    }
});

// ===== Stripe Payment Links =====
// These are placeholder Stripe payment links. Replace with actual Stripe product links.
const STRIPE_BASE_URL = 'https://buy.stripe.com/';

function getStripeLink(productName) {
    // Map product names to Stripe payment links
    const links = {
        'Island Escape Premium Tee': 'https://buy.stripe.com/test_placeholder_island_escape',
        'Island Palm Resort Shirt': 'https://buy.stripe.com/test_placeholder_resort_shirt',
        'Sunset Crest Cap': 'https://buy.stripe.com/test_placeholder_sunset_crest',
        'Rod & Palm Tee': 'https://buy.stripe.com/test_placeholder_rod_palm',
        'Mahi-Mahi Premium Tee': 'https://buy.stripe.com/test_placeholder_mahi',
        'Signature Crest Tee': 'https://buy.stripe.com/test_placeholder_crest',
        'Tiki Bar Islander Tee': 'https://buy.stripe.com/test_placeholder_tiki',
        'Snook Hunter Tee': 'https://buy.stripe.com/test_placeholder_snook',
        'Nautical Chart Resort Shirt': 'https://buy.stripe.com/test_placeholder_nautical',
        'Lighthouse Sunset Cap': 'https://buy.stripe.com/test_placeholder_lighthouse',
        'Coastal Vista Premium Tee': 'https://buy.stripe.com/test_placeholder_coastal',
        'Island Crest Beach Towel': 'https://buy.stripe.com/test_placeholder_towel',
        'Island Travel Mug': 'https://buy.stripe.com/test_placeholder_mug',
        'Breesy\'s Island Kids Tee': 'https://buy.stripe.com/test_placeholder_kids',
        'Sailfish Jump Tee': 'https://buy.stripe.com/test_placeholder_sailfish'
    };
    return links[productName] || '#';
}

// Initialize cart on load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace('$', ''));
            const img = card.querySelector('.product-image img').getAttribute('src');
            addToCart(name, price, img);
        });
    });
    
    // Buy Now buttons
    document.querySelectorAll('.btn-buy-now').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const link = getStripeLink(name);
            if (link && link !== '#') {
                window.open(link, '_blank');
            } else {
                showToast('Stripe checkout coming soon! Add to cart for now.');
            }
        });
    });
    
    // Cart close button
    document.querySelector('.cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
    
    // Checkout button
    document.querySelector('.cart-checkout-btn')?.addEventListener('click', function() {
        if (cart.length === 0) {
            showToast('Your bag is empty! Add some items first.');
            return;
        }
        showToast('Checkout coming soon! Thank you for shopping at Breesy\'s Island.');
    });
    
    // Continue shopping
    document.querySelector('.cart-continue-btn')?.addEventListener('click', closeCart);
    
    // Escape key to close cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeCart();
    });
});