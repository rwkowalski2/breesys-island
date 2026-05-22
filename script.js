// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 29, 61, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 29, 61, 0.95)';
    }
    lastScroll = currentScroll;
});

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const email = input.value.trim();
    if (email) {
        alert('Welcome to the island crew! Check your email for 10% off.');
        input.value = '';
    }
});

// Product pre-order buttons
document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const product = this.closest('.product-card');
        const name = product.querySelector('h3').textContent;
        alert(`${name} — pre-order coming soon! We'll notify you when the collection drops.`);
    });
});