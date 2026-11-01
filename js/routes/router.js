import { renderShop } from '../views/shop.js?v=20261101-socket-market-v2';
import { renderCart } from '../views/cart.js?v=20261101-socket-market-v2';
import { renderPurchases } from '../views/purchase.js?v=20261101-socket-market-v2';
import { renderReservation, renderAffiliate, renderRewards, renderSupport, renderBalance } from '../views/others.js?v=20261101-socket-market-v2';
import { store } from '../store/state.js?v=20261101-socket-market-v2';
import { getIcon } from '../utils/icons.js?v=20261101-socket-market-v2';

export const router = {
    currentRoute: 'shop',
    toastTimer: null,
    carouselTimer: null,

    routes: {
        shop: renderShop,
        cart: renderCart,
        orders: renderPurchases,
        rsv: renderReservation,
        aff: renderAffiliate,
        rew: renderRewards,
        sup: renderSupport,
        balance: renderBalance
    },

    tabs: [
        ['shop', 'Cartes', 'cards'],
        ['cart', 'Panier', 'cart'],
        ['orders', 'Achats', 'bag'],
        ['rsv', 'Réservation', 'cal']
    ],

    init() {
        this.renderNav();
        this.renderMore();
        this.renderRecharge();
        this.bindEvents();
        this.navigate('shop');
        this.startCarousel();
    },

    renderNav() {
        const count = store.cart.reduce((sum, item) => sum + item.qty, 0);
        document.getElementById('app-nav').innerHTML = this.tabs.map(([id, label, icon]) => `
            <button class="tab ${this.currentRoute === id ? 'on' : ''}" data-tab="${id}" ${this.currentRoute === id ? 'aria-current="page"' : ''}>
                ${getIcon(icon)}<span>${label}</span>
                ${id === 'cart' && count ? `<span class="n">${count}</span>` : ''}
            </button>
        `).join('');
    },

    renderMore() {
        document.querySelector('#more .more-in').innerHTML = [
            ['balance', 'Solde', 'wallet'],
            ['aff', 'Affilié', 'users'],
            ['rew', 'Récompenses', 'gift'],
            ['sup', 'Support', 'help']
        ].map(([id, label, icon]) => `
            <button role="menuitem" data-more="${id}">${getIcon(icon)}<span>${label}</span></button>
        `).join('');
    },

    renderRecharge() {
        document.getElementById('amounts').innerHTML = [5, 10, 20, 50]
            .map(amount => `<button data-top="${amount}">${amount} €</button>`)
            .join('');
    },

    navigate(routeName) {
        if (!this.routes[routeName]) return;
        this.currentRoute = routeName;
        document.getElementById('app-content').innerHTML = this.routes[routeName]() ;
        this.renderNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (routeName === 'rsv') {
            const dateInput = document.getElementById('rd');
            if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
        }
    },

    startCarousel() {
        clearInterval(this.carouselTimer);
        this.carouselTimer = setInterval(() => {
            if (this.currentRoute !== 'shop') return;
            store.slide = (store.slide + 1) % store.slides.length;
            document.querySelectorAll('.slide').forEach((slide, index) => slide.classList.toggle('on', index === store.slide));
            document.querySelectorAll('.dots button').forEach((dot, index) => dot.classList.toggle('on', index === store.slide));
        }, 4000);
    },

    closeMore() {
        document.getElementById('more').classList.remove('open');
        document.getElementById('plusBtn').classList.remove('open');
        document.getElementById('plusBtn').setAttribute('aria-expanded', 'false');
    },

    toggleMore() {
        const more = document.getElementById('more');
        const open = more.classList.toggle('open');
        document.getElementById('plusBtn').classList.toggle('open', open);
        document.getElementById('plusBtn').setAttribute('aria-expanded', String(open));
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    },

    bindEvents() {
        document.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!event.target.closest('#more') && !(button && button.id === 'plusBtn')) this.closeMore();
            if (!button) return;

            if (button.dataset.tab) return this.navigate(button.dataset.tab);
            if (button.dataset.go) return this.navigate(button.dataset.go);
            if (button.dataset.more) {
                this.closeMore();
                return button.dataset.more === 'balance'
                    ? document.getElementById('sheet').classList.add('open')
                    : this.navigate(button.dataset.more);
            }

            if (button.id === 'plusBtn') return this.toggleMore();
            if (button.id === 'closeSheet') return document.getElementById('sheet').classList.remove('open');
            if (button.id === 'walletBtn') return document.getElementById('sheet').classList.add('open');

            if (button.dataset.add) {
                store.addToCart(Number(button.dataset.add));
                this.renderNav();
                return this.showToast('Ajouté au panier');
            }

            if (button.dataset.inc) {
                store.addToCart(Number(button.dataset.inc));
                return this.navigate('cart');
            }

            if (button.dataset.dec) {
                store.removeFromCart(Number(button.dataset.dec));
                return this.navigate('cart');
            }

            if (button.dataset.limit) {
                store.limit = Number(button.dataset.limit);
                return this.navigate('shop');
            }

            if (button.dataset.slide) {
                store.slide = Number(button.dataset.slide);
                this.startCarousel();
                return this.navigate('shop');
            }

            if (button.dataset.copy) {
                navigator.clipboard?.writeText(button.dataset.copy).catch(() => {});
                return this.showToast('Code copié');
            }

            if (button.id === 'searchBtn') {
                store.open = !store.open;
                this.navigate('shop');
                if (store.open) {
                    const input = document.getElementById('q');
                    input?.focus();
                    input?.setSelectionRange(input.value.length, input.value.length);
                }
                return;
            }

            if (button.id === 'seeNew') {
                document.getElementById('plist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            if (button.id === 'pay') {
                const result = store.validatePurchase();
                if (!result.success) return this.showToast(result.message);
                this.showToast('Paiement effectué');
                return this.navigate('orders');
            }

            if (button.dataset.support) return this.showToast('Le support sera disponible prochainement');

            const topup = button.dataset.top;
            if (topup) {
                store.wallet += Number(topup);
                document.getElementById('sheet').classList.remove('open');
                this.navigate(this.currentRoute);
                return this.showToast(`${topup} € ajoutés à votre solde`);
            }
        });

        document.addEventListener('input', event => {
            if (event.target.id !== 'q') return;
            store.q = event.target.value;
            const query = store.q.toLowerCase().trim();
            const list = store.products.filter(product =>
                (product.name + ' ' + product.cat + ' ' + product.zone).toLowerCase().includes(query)
            ).slice(0, store.limit);
            document.getElementById('plist').innerHTML = list.length
                ? list.map(product => renderShopProduct(product)).join('')
                : '<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>';
        });

        document.addEventListener('submit', event => {
            if (event.target.id !== 'rsvForm') return;
            event.preventDefault();
            const date = new Date(document.getElementById('rd').value).toLocaleDateString('fr-FR');
            store.rsv.unshift({ id: Number(document.getElementById('rp').value), date });
            this.showToast('Réservation enregistrée');
            this.navigate('rsv');
        });

        document.getElementById('sheet').addEventListener('click', event => {
            if (event.target.id === 'sheet') event.currentTarget.classList.remove('open');
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                document.getElementById('sheet').classList.remove('open');
                this.closeMore();
            }
        });
    }
};

function renderShopProduct(product) {
    return `<article class="card">
        <div class="logo" style="background:${product.color}">${product.ini}</div>
        <div><h4>${product.name}</h4><div class="sub">${product.cat}, valeur ${product.value.toFixed(2).replace('.', ',')} €</div></div>
        <div><button class="buy" data-add="${product.id}">+ Ajouter</button><div class="when">${product.ago}</div></div>
        <div class="info"><span>${getIcon('globe')}${product.zone}</span><span>${getIcon('bolt')}Livraison immédiate</span><span class="price">${product.price.toFixed(2).replace('.', ',')} €</span></div>
    </article>`;
}