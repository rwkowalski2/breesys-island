// ===== Breesy's Island - Main Script =====

// ===== Performance: Lazy loading images =====
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('.product-image img, .about-image img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
});

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
    if (totalEl) totalEl.textContent = '$' + total;
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
                    <button class="qty-btn" onclick="decrementQty(${index})">-</button>
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
    showToast(name + ' added to your bag!');
    openCart();
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(item.name + ' removed from your bag.');
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

// ===== Product Detail Modal =====
function openProductModal(productCard) {
    const name = productCard.querySelector('h3').textContent;
    const desc = productCard.querySelector('.product-desc').textContent;
    const priceText = productCard.querySelector('.product-price').textContent;
    const img = productCard.querySelector('.product-image img').getAttribute('src');
    const badge = productCard.querySelector('.product-badge');
    const badgeText = badge ? badge.textContent : '';
    
    document.getElementById('modalProductImage').setAttribute('src', img);
    document.getElementById('modalProductImage').setAttribute('alt', name);
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductPrice').textContent = priceText;
    document.getElementById('modalProductDesc').textContent = desc;
    
    const badgeEl = document.getElementById('modalProductBadge');
    if (badgeText) {
        badgeEl.textContent = badgeText;
        badgeEl.style.display = 'inline-block';
    } else {
        badgeEl.style.display = 'none';
    }
    
    // Store product data for modal buttons
    document.getElementById('modalAddToCart').dataset.name = name;
    document.getElementById('modalAddToCart').dataset.price = priceText.replace('$', '');
    document.getElementById('modalAddToCart').dataset.img = img;
    document.getElementById('modalBuyNow').dataset.name = name;
    
    document.getElementById('productModal').classList.add('active');
    document.getElementById('productModalContent').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productModalContent').classList.remove('active');
    document.body.style.overflow = '';
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
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address.');
            return;
        }
        showToast('Welcome to the island crew! Check your email for 10% off.');
        input.value = '';
        
        // Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', { 'email': email });
        }
    }
});

// ===== Stripe Payment Links =====
function getStripeLink(productName) {
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
        "Breesy's Island Kids Tee": 'https://buy.stripe.com/test_placeholder_kids',
        'Sailfish Jump Tee': 'https://buy.stripe.com/test_placeholder_sailfish'
    };
    return links[productName] || '#';
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Product card click to open modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking buttons
            if (e.target.closest('.btn-primary, .btn-add-cart, .btn-buy-now')) return;
            openProductModal(this);
        });
    });
    
    // Add to cart buttons (from product cards and modal)
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.product-card') || this.closest('.modal');
            const name = this.dataset.name || card.querySelector('h3').textContent;
            const priceText = this.dataset.price || card.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace('$', ''));
            const img = this.dataset.img || card.querySelector('.product-image img, .modal-image img').getAttribute('src');
            addToCart(name, price, img);
        });
    });
    
    // Buy Now buttons
    document.querySelectorAll('.btn-buy-now').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const name = this.dataset.name || this.closest('.product-card')?.querySelector('h3').textContent;
            const link = getStripeLink(name);
            if (link && link !== '#') {
                window.open(link, '_blank');
            } else {
                showToast('Stripe checkout coming soon! Add to cart for now.');
            }
        });
    });
    
    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', closeProductModal);
    document.getElementById('productModal')?.addEventListener('click', closeProductModal);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
    document.querySelector('.cart-close')?.addEventListener('click', closeCart);
    
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
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
            closeProductModal();
        }
    });
    
    // Track page view (Google Analytics placeholder)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-XXXXXXXXXX', { 'page_title': document.title });
    }
});