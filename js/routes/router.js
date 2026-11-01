import { renderShop } from './views/shop.js';
import { renderCart } from './views/cart.js';
import { renderPurchases } from './views/purchase.js';
import { renderReservation, renderAffiliate, renderRewards, renderSupport, renderBalance } from './views/others.js';
import { store } from './store/state.js';
import { getIcon } from './utils/icons.js';
import { eur } from './utils/format.js';

export const router = {
    currentRoute: 'shop',

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

        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab');
            if (btn) this.navigate(btn.dataset.tab);
        });
    },

    renderMoreMenu() {
        const more = document.querySelector('#more .more-in');
        more.innerHTML = this.moreItems.map(item => `
            <button role="menuitem" data-more="${item.id}">
                ${getIcon(item.icon)}<span>${item.label}</span>
            </button>
        `).join('');
    },

    bindGlobalEvents() {
        // Bouton "+" (recharge / menu plus)
        const plusBtn = document.getElementById('plusBtn');
        plusBtn.addEventListener('click', () => {
            const more = document.getElementById('more');
            const open = more.classList.toggle('open');
            plusBtn.classList.toggle('open', open);
            plusBtn.setAttribute('aria-expanded', open);
        });

        // Clic sur le menu "plus"
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

        // Fermer le sheet
        document.getElementById('closeSheet').addEventListener('click', () => {
            document.getElementById('sheet').classList.remove('open');
        });
        document.getElementById('sheet').addEventListener('click', (e) => {
            if (e.target.id === 'sheet') e.currentTarget.classList.remove('open');
        });

        // Boutons montants recharge
        document.getElementById('amounts').innerHTML = [5, 10, 20, 50]
            .map(a => `<button data-top="${a}">${a} €</button>`).join('');
        document.getElementById('amounts').addEventListener('click', (e) => {
            const b = e.target.closest('[data-top]');
            if (!b) return;
            store.wallet += +b.dataset.top;
            document.getElementById('sheet').classList.remove('open');
            this.showToast(`${b.dataset.top} € ajoutés à votre solde`);
            this.navigate(this.currentRoute);
        });

        // Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('sheet').classList.remove('open');
                this.closeMore();
            }
        });

        // Recherche (input)
        document.addEventListener('input', (e) => {
            if (e.target.id === 'q') {
                store.q = e.target.value;
                const list = store.products
                    .filter(p => (p.name + ' ' + p.cat + ' ' + p.zone).toLowerCase().includes(store.q.toLowerCase().trim()))
                    .slice(0, store.limit);
                const container = document.getElementById('plist');
                if (container) {
                    container.innerHTML = list.map(p => this.productCardHTML(p)).join('')
                        || `<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>`;
                }
            }
        });

        // Réservation (submit)
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'rsvForm') {
                e.preventDefault();
                const d = new Date(document.getElementById('rd').value).toLocaleDateString('fr-FR');
                store.rsv.unshift({ id: +document.getElementById('rp').value, date: d });
                this.showToast('Réservation enregistrée');
                this.navigate('rsv');
            }
        });
    },

    // Helper réutilisé pour le rendu d'une carte produit (évite d'importer shop.js)
    productCardHTML(p) {
        const CAT = { jeux: 'Jeux', streaming: 'Streaming', recharge: 'Recharge téléphone' };
        return `<article class="card">
            <div class="logo" style="background:${p.color}">${p.ini}</div>
            <div><h4>${p.name}</h4><div class="sub">${CAT[p.cat] || p.cat}, valeur ${eur(p.value)}</div></div>
            <div><button class="buy" data-add="${p.id}">+ Ajouter</button><div class="when">${p.ago}</div></div>
            <div class="info">
                <span>${getIcon('globe')}${p.zone}</span>
                <span>${getIcon('bolt')}Livraison immédiate</span>
                <span class="price">${eur(p.price)}</span>
            </div>
        </article>`;
    },

    navigate(routeName) {
        if (!this.routes[routeName]) return;
        this.currentRoute = routeName;
        this.closeMore();

        // Onglets actifs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('on', tab.dataset.tab === routeName);
            if (tab.dataset.tab === routeName) tab.setAttribute('aria-current', 'page');
            else tab.removeAttribute('aria-current');
        });

        // Badge panier
        const cartCount = store.cart.reduce((s, i) => s + i.qty, 0);
        const cartTab = document.querySelector('.tab[data-tab="cart"]');
        if (cartTab) {
            const oldBadge = cartTab.querySelector('.n');
            if (oldBadge) oldBadge.remove();
            if (cartCount) {
                const badge = document.createElement('span');
                badge.className = 'n';
                badge.textContent = cartCount;
                cartTab.appendChild(badge);
            }
        }

        // Rendu de la vue
        const content = document.getElementById('app-content');
        content.innerHTML = this.routes[routeName]();

        // Date min pour réservation
        if (routeName === 'rsv') {
            const d = document.getElementById('rd');
            if (d) d.min = new Date().toISOString().slice(0, 10);
        }

        // Bind des événements spécifiques à la vue
        this.bindViewEvents(routeName);

        // Carrousel
        if (routeName === 'shop') this.startCarousel();
        else clearInterval(store.timer);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindViewEvents(routeName) {
        // Boutons "data-add"
        document.querySelectorAll('[data-add]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.addToCart(+btn.dataset.add);
                this.showToast('Ajouté au panier');
                // Rafraîchir le badge
                const cartCount = store.cart.reduce((s, i) => s + i.qty, 0);
                const cartTab = document.querySelector('.tab[data-tab="cart"]');
                if (cartTab) {
                    const oldBadge = cartTab.querySelector('.n');
                    if (oldBadge) oldBadge.remove();
                    if (cartCount) {
                        const badge = document.createElement('span');
                        badge.className = 'n';
                        badge.textContent = cartCount;
                        cartTab.appendChild(badge);
                    }
                }
            });
        });

        // Boutons "data-go"
        document.querySelectorAll('[data-go]').forEach(btn => {
            btn.addEventListener('click', () => this.navigate(btn.dataset.go));
        });

        // Filtres limite
        document.querySelectorAll('[data-limit]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.limit = +btn.dataset.limit;
                this.navigate('shop');
            });
        });

        // Dots carrousel
        document.querySelectorAll('[data-slide]').forEach(btn => {
            btn.addEventListener('click', () => {
                store.slide = +btn.dataset.slide;
                this.startCarousel();
                this.navigate('shop');
            });
        });

        // Recherche (toggle)
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

        // "Voir" nouvelles cartes
        const seeNew = document.getElementById('seeNew');
        if (seeNew) {
            seeNew.addEventListener('click', () => {
                document.getElementById('plist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Panier : + / -
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

        // Paiement
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
                    this.navigate('purchase');
                } else {
                    this.showToast(result.message);
                }
            });
        }

        // Copier code
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard?.writeText(btn.dataset.copy).catch(() => {});
                this.showToast('Code copié');
            });
        });

        // Support
        document.querySelectorAll('[data-support]').forEach(btn => {
            btn.addEventListener('click', () => this.showToast('Le support sera branché dans la version finale'));
        });
    },

    startCarousel() {
        clearInterval(store.timer);
        store.timer = setInterval(() => {
            if (this.currentRoute !== 'shop') return;
            store.slide = (store.slide + 1) % store.slides.length;
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
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }
};