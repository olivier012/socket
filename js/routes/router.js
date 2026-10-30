import { renderShop } from '../views/shop.js';
import { renderCart } from '../views/cart.js';
import { renderPurchases } from '../views/purchase.js';
import { renderBalance, renderReservation, renderAffiliate, renderSupport } from '../views/others.js';
import { store } from '../store/state.js';
import { getIcon } from '../utils/icons.js';
import { formatMoneyShort } from '../utils/format.js';

export const router = {
    currentRoute: 'shop',

    routes: {
        shop: renderShop,
        cart: renderCart,
        purchase: renderPurchases,
        balance: renderBalance,
        reservation: renderReservation,
        affiliate: renderAffiliate,
        support: renderSupport
    },

    navItems: [
        { id: 'shop', label: 'Boutique', icon: 'shop' },
        { id: 'purchase', label: 'Achat', icon: 'purchase' },
        { id: 'cart', label: 'Panier', icon: 'cart' },
        { id: 'reservation', label: 'Réservation', icon: 'reservation' },
        { id: 'balance', label: 'Solde', icon: 'balance' },
        { id: 'affiliate', label: 'Affilié', icon: 'affiliate' },
        { id: 'support', label: 'Support', icon: 'support' }
    ],

    init() {
        this.renderNav();
        this.navigate('shop');
    },

    renderNav() {
        const nav = document.getElementById('app-nav');
        nav.innerHTML = this.navItems.map(item => `
            <button class="nav-item" data-tab="${item.id}">
                ${getIcon(item.icon)}
                <span>${item.label}</span>
            </button>
        `).join('');

        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-item');
            if (btn) this.navigate(btn.dataset.tab);
        });
    },

    navigate(routeName) {
        if (!this.routes[routeName]) return;
        
        this.currentRoute = routeName;

        // 1. Mettre à jour le bouton actif
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.dataset.tab === routeName);
        });

        // 2. Afficher la vue
        const content = document.getElementById('app-content');
        content.innerHTML = this.routes[routeName]();

        // 3. Mettre à jour le solde
        document.getElementById('walletHeader').textContent = formatMoneyShort(store.wallet);
        document.getElementById('availableCards').textContent =
            `${store.products.reduce((sum, product) => sum + Number(product.count || 0), 0)} cartes disponibles`;

        // 4. Attacher les événements spécifiques à la vue
        this.bindEvents(routeName);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindEvents(routeName) {
        if (routeName === 'shop') {
            clearInterval(this.carouselTimer);
            const slides = [...document.querySelectorAll('.promo-slide')];
            const dots = [...document.querySelectorAll('.promo-dot')];
            let slideIndex = 0;
            const showSlide = (index) => {
                slideIndex = (index + slides.length) % slides.length;
                slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
                dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
            };
            dots.forEach(dot => dot.addEventListener('click', () => {
                showSlide(Number(dot.dataset.slide));
                clearInterval(this.carouselTimer);
                this.carouselTimer = setInterval(() => showSlide(slideIndex + 1), 4000);
            }));
            if (slides.length) {
                showSlide(0);
                this.carouselTimer = setInterval(() => showSlide(slideIndex + 1), 4000);
            }

            const searchInput = document.getElementById('search');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.navigate('shop'));
                // Remettre le focus après le re-render
                searchInput.focus();
                searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
            }

            document.querySelectorAll('.add').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const product = store.products.find(p => p.id === id);
                    const result = store.addToCart(product);
                    
                    if (result.success) {
                        this.showToast(result.message);
                        e.target.textContent = '✓';
                        setTimeout(() => this.navigate('shop'), 800);
                    } else {
                        this.showToast(result.message);
                    }
                });
            });
        }

        if (routeName === 'cart') {
            document.querySelectorAll('[data-remove]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    store.removeFromCart(parseInt(e.target.dataset.remove));
                    this.navigate('cart');
                });
            });

            document.querySelectorAll('[data-validate]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const result = store.validatePurchase(parseInt(e.target.dataset.validate));
                    if (result.success) {
                        this.showToast('Achat validé');
                        this.navigate('cart');
                    } else {
                        this.showToast('Solde insuffisant');
                    }
                });
            });

            const validateAllBtn = document.getElementById('validateCartBtn');
            if (validateAllBtn) {
                validateAllBtn.addEventListener('click', () => {
                    const result = store.validatePurchase();
                    if (result.success) {
                        this.showToast('Panier validé');
                        this.navigate('cart');
                    } else {
                        this.showToast('Solde insuffisant');
                    }
                });
            }
        }
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
    }
};