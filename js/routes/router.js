import { renderShop } from './views/shop.js';
import { renderCart } from './views/cart.js';
import { renderPurchases } from './views/purchase.js';
import { renderReservation, renderAffiliate, renderRewards, renderSupport, renderBalance } from './views/others.js';
import { store } from './store/state.js';
import { getIcon } from './utils/icons.js';
import { eur } from './utils/format.js';

export const router = {
    currentRoute: 'shop',
    carouselTimer: null,

    routes: {
        shop: renderShop,
        cart: renderCart,
        purchase: renderPurchases,
        rsv: renderReservation,
        affiliate: renderAffiliate,
        rewards: renderRewards,
        support: renderSupport,
        balance: renderBalance
    },

    tabs: [
        { id: 'shop', label: 'Cartes', icon: 'cards' },
        { id: 'cart', label: 'Panier', icon: 'cart' },
        { id: 'purchase', label: 'Achats', icon: 'bag' },
        { id: 'rsv', label: 'Réservation', icon: 'cal' }
    ],

    moreItems: [
        { id: 'balance', label: 'Solde', icon: 'wallet' },
        { id: 'affiliate', label: 'Affilié', icon: 'users' },
        { id: 'rewards', label: 'Récompenses', icon: 'gift' },
        { id: 'support', label: 'Support', icon: 'help' }
    ],

    init() {
        this.renderNav();
        this.renderMoreMenu();
        this.bindGlobalEvents();
        this.navigate('shop');
    },

    renderNav() {
        const nav = document.getElementById('app-nav');
        nav.innerHTML = this.tabs.map(item => `
            <button class="tab" data-tab="${item.id}">
                ${getIcon(item.icon)}
                <span>${item.label}</span>
            </button>
        `).join('');
    },

    renderMoreMenu() {
        const more = document.querySelector('#more .more-in');
        if (!more) return;
        more.innerHTML = this.moreItems.map(item => `
            <button role="menuitem" data-more="${item.id}">
                ${getIcon(item.icon)}<span>${item.label}</span>
            </button>
        `).join('');
    },

    // Met à jour le badge du panier en fonction de l'état actuel
    updateCartBadge() {
        const cartCount = store.cart.reduce((s, i) => s + i.qty, 0);
        const cartTab = document.querySelector('.tab[data-tab="cart"]');
        if (cartTab) {
            const oldBadge = cartTab.querySelector('.n');
            if (oldBadge) oldBadge.remove();
            if (cartCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'n';
                badge.textContent = cartCount;
                cartTab.appendChild(badge);
            }
        }
    },

    // Met à jour le solde affiché dans le header sans recharger la vue
    updateWalletDisplay() {
        const walletSpan = document.querySelector('.wallet span');
        if (walletSpan) {
            walletSpan.textContent = eur(store.wallet);
        }
    },

    bindGlobalEvents() {
        // Navigation (Onglets bas)
        document.getElementById('app-nav').addEventListener('click', (e) => {
            const btn = e.target.closest('.tab');
            if (btn) this.navigate(btn.dataset.tab);
        });

        // Bouton "+" (Menu Plus)
        const plusBtn = document.getElementById('plusBtn');
        plusBtn.addEventListener('click', () => {
            const more = document.getElementById('more');
            const open = more.classList.toggle('open');
            plusBtn.classList.toggle('open', open);
            plusBtn.setAttribute('aria-expanded', open);
        });

        // Clic sur le menu "Plus"
        document.getElementById('more').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-more]');
            if (!btn) return;
            this.closeMore();
            if (btn.dataset.more === 'balance') {
                document.getElementById('sheet').classList.add('open');
            } else {
                this.navigate(btn.dataset.more);
            }
        });

        // Recharger le solde (Sheet)
        document.getElementById('closeSheet').addEventListener('click', () => {
            document.getElementById('sheet').classList.remove('open');
        });
        document.getElementById('sheet').addEventListener('click', (e) => {
            if (e.target.id === 'sheet') e.currentTarget.classList.remove('open');
        });

        // Boutons montants recharge
        const amountsContainer = document.getElementById('amounts');
        if (amountsContainer) {
            amountsContainer.innerHTML = [5, 10, 20, 50]
                .map(a => `<button data-top="${a}">${a} €</button>`).join('');
            
            amountsContainer.addEventListener('click', (e) => {
                const b = e.target.closest('[data-top]');
                if (!b) return;
                store.wallet += +b.dataset.top;
                document.getElementById('sheet').classList.remove('open');
                this.showToast(`${b.dataset.top} € ajoutés à votre solde`);
                this.updateWalletDisplay();
                this.navigate(this.currentRoute); // Rafraîchir la vue actuelle
            });
        }

        // Fermer avec Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('sheet').classList.remove('open');
                this.closeMore();
            }
        });
    },

    navigate(routeName) {
        if (!this.routes[routeName]) return;
        this.currentRoute = routeName;
        this.closeMore();
        clearInterval(this.carouselTimer);

        // 1. Mise à jour des onglets actifs
        document.querySelectorAll('.tab').forEach(tab => {
            const isActive = tab.dataset.tab === routeName;
            tab.classList.toggle('on', isActive);
            if (isActive) tab.setAttribute('aria-current', 'page');
            else tab.removeAttribute('aria-current');
        });

        // 2. Mise à jour du badge panier
        this.updateCartBadge();

        // 3. Injection du HTML de la vue
        const content = document.getElementById('app-content');
        content.innerHTML = this.routes[routeName]();

        // 4. Initialisation des événements spécifiques à la vue
        this.bindViewEvents(routeName);

        // 5. Gestion du carrousel (uniquement sur la boutique)
        if (routeName === 'shop') {
            this.startCarousel();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindViewEvents(routeName) {
        // --- BOUTONS "+ ACHETER" ---
        document.querySelectorAll('[data-add]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = +btn.dataset.add;
                store.addToCart(id);
                this.showToast('Ajouté au panier');
                this.updateCartBadge();
            });
        });

        // --- BOUTONS "VOIR" / "ALLER À" (data-go) ---
        document.querySelectorAll('[data-go]').forEach(btn => {
            btn.addEventListener('click', () => this.navigate(btn.dataset.go));
        });

        // --- FILTRES D'AFFICHAGE (30, 60, 100, Tout) ---
        document.querySelectorAll('[data-limit]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.limit = +btn.dataset.limit;
                this.navigate('shop');
            });
        });

        // --- CARROUSEL (Points de navigation) ---
        document.querySelectorAll('[data-slide]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.slide = +btn.dataset.slide;
                this.startCarousel();
                this.navigate('shop');
            });
        });

        // --- BARRE DE RECHERCHE ---
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                store.open = !store.open;
                const sbar = document.getElementById('sbar');
                if (sbar) {
                    sbar.classList.toggle('open', store.open);
                    if (store.open) document.getElementById('q')?.focus();
                }
            });
        }

        const searchInput = document.getElementById('q');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                store.q = e.target.value;
                // Re-render uniquement la liste pour garder le focus
                const list = store.products
                    .filter(p => (p.name + ' ' + p.cat + ' ' + p.zone).toLowerCase().includes(store.q.toLowerCase().trim()))
                    .slice(0, store.limit);
                
                const container = document.getElementById('plist');
                if (container) {
                    // On importe productCardHTML dynamiquement ou on le récupère
                    import('./views/shop.js').then(module => {
                        container.innerHTML = list.map(module.productCardHTML).join('')
                            || `<div class="empty"><b>Aucun résultat</b>Essayez une autre recherche.</div>`;
                    });
                }
            });
        }

        // --- BOUTON "VOIR" NOUVELLES CARTES ---
        const seeNew = document.getElementById('seeNew');
        if (seeNew) {
            seeNew.addEventListener('click', () => {
                document.getElementById('plist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // --- PANIER : BOUTONS + / - ---
        document.querySelectorAll('[data-inc]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.addToCart(+btn.dataset.inc);
                this.navigate('cart');
            });
        });
        document.querySelectorAll('[data-dec]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.removeFromCart(+btn.dataset.dec);
                this.navigate('cart');
            });
        });

        // --- BOUTON PAYER ---
        const payBtn = document.getElementById('pay');
        if (payBtn) {
            payBtn.addEventListener('click', () => {
                const total = store.cart.reduce((s, i) => s + store.products.find(p => p.id === i.id).price * i.qty, 0);
                if (total > store.wallet) {
                    this.showToast('Solde insuffisant, rechargez votre portefeuille');
                    return;
                }
                const result = store.validatePurchase();
                if (result.success) {
                    this.showToast('Paiement effectué');
                    this.updateWalletDisplay();
                    this.navigate('purchase');
                } else {
                    this.showToast(result.message);
                }
            });
        }

        // --- COPIER LE CODE ---
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard?.writeText(btn.dataset.copy).catch(() => {});
                this.showToast('Code copié');
            });
        });

        // --- SUPPORT ---
        document.querySelectorAll('[data-support]').forEach(btn => {
            btn.addEventListener('click', () => this.showToast('Le support sera branché dans la version finale'));
        });

        // --- FORMULAIRE RÉSERVATION ---
        const rsvForm = document.getElementById('rsvForm');
        if (rsvForm) {
            const dateInput = document.getElementById('rd');
            if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

            rsvForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const d = new Date(document.getElementById('rd').value).toLocaleDateString('fr-FR');
                store.rsv.unshift({ id: +document.getElementById('rp').value, date: d });
                this.showToast('Réservation enregistrée');
                this.navigate('rsv');
            });
        }
    },

    startCarousel() {
        clearInterval(this.carouselTimer);
        this.carouselTimer = setInterval(() => {
            if (this.currentRoute !== 'shop') return;
            store.slide = (store.slide + 1) % store.slides.length;
            
            // Mise à jour visuelle sans re-render complet
            document.querySelectorAll('.slide').forEach((el, i) => el.classList.toggle('on', i === store.slide));
            document.querySelectorAll('.dots button').forEach((el, i) => el.classList.toggle('on', i === store.slide));
        }, 4000);
    },

    closeMore() {
        document.getElementById('more').classList.remove('open');
        document.getElementById('plusBtn').classList.remove('open');
        document.getElementById('plusBtn').setAttribute('aria-expanded', 'false');
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }
};