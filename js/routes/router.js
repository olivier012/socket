
import { renderShop, renderShopProduct } from '../views/shop.js?v=20261102-card-v44';
import { renderCart } from '../views/cart.js?v=20261102-card-v44';
import { renderPurchases } from '../views/purchase.js?v=20261102-card-v44';
import { renderReservation, renderBalance } from '../views/others.js?v=20261102-card-v44';
import { renderAffiliate } from '../views/affiliate.js?v=20261102-card-v44';
import { renderRewards } from '../views/rewards.js?v=20261102-card-v44';
import { renderSupport } from '../views/support.js?v=20261102-card-v44';
import { renderRechargeSelection, renderCryptoPayment } from '../views/solde.js?v=20261102-card-v44';
import { store } from '../store/state.js?v=20261102-card-v44';
import { getIcon } from '../utils/icons.js?v=20261102-card-v44';

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
        document.getElementById('rechargeContent').innerHTML = renderRechargeSelection();
    },

    navigate(routeName) {
        if (!this.routes[routeName]) return;
        if (routeName !== 'shop') store.shopSearchOpen = false;
        if (routeName !== 'rew') store.rewardHistoryOpen = false;
        if (routeName !== 'sup') {
            store.supportNewOpen = false;
            store.supportTab = 'assistance';
            store.supportTicketOpen = null;
        }
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

    startPaymentTimer(assetId, amount) {
        clearInterval(store.timer);
        const asset = String(assetId).toUpperCase();
        const pending = store.pendingRecharges.find(item => item.asset === asset && item.amount === amount && item.expiresAt > Date.now());
        let seconds = pending
            ? Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1000))
            : 3599;
        store.timer = setInterval(() => {
            seconds = Math.max(0, seconds - 1);
            const timer = document.getElementById('paymentTimer');
            if (timer) timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
            store.pendingRecharges.forEach(pending => {
                const remaining = Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1000));
                document.querySelectorAll(`[data-recharge-history-timer="${pending.id}"]`).forEach(element => {
                    element.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
                });
            });
        }, 1000);
    },

    openRechargeSheet() {
        store.rechargeHistoryOpen = false;
        this.renderRecharge();
        document.getElementById('sheet').classList.remove('payment-sheet');
        document.getElementById('sheet').classList.add('open');
        document.body.classList.add('recharge-open');
    },

    bindEvents() {
        window.supportAction = action => {
            if (action === 'new') store.supportNewOpen = true;
            if (action === 'close') store.supportNewOpen = false;
            if (action === 'closeChat') store.supportTicketOpen = null;
            if (action === 'assistance' || action === 'history' || action === 'policy') {
                store.supportTab = action;
                store.supportNewOpen = false;
                store.supportTicketOpen = null;
            }
            this.navigate('sup');
        };

        document.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!event.target.closest('#more') && !(button && button.id === 'plusBtn')) this.closeMore();
            if (!button) return;

            if (button.getAttribute('data-support-tab') !== null) {
                store.supportTab = button.getAttribute('data-support-tab');
                store.supportNewOpen = false;
                this.navigate('sup');
                return;
            }
            if (button.getAttribute('data-support-new') !== null) {
                store.supportNewOpen = true;
                this.navigate('sup');
                return;
            }
            if (button.getAttribute('data-support-new-close') !== null) {
                store.supportNewOpen = false;
                this.navigate('sup');
                return;
            }
            if (button.getAttribute('data-support-chat-close') !== null) {
                store.supportTicketOpen = null;
                store.supportTab = 'history';
                this.navigate('sup');
                return;
            }
            if (button.dataset.openSupportTicket) {
                store.supportTicketOpen = button.dataset.openSupportTicket;
                store.supportTab = 'history';
                this.navigate('sup');
                return;
            }
            if (button.dataset.tab) return this.navigate(button.dataset.tab);
            if (button.dataset.go) return this.navigate(button.dataset.go);
            if (button.hasAttribute('data-toggle-reservations')) {
                store.rsvOpen = !store.rsvOpen;
                const panel = document.getElementById('reservationList');
                panel?.classList.toggle('open', store.rsvOpen);
                button.setAttribute('aria-expanded', String(store.rsvOpen));
                return;
            }
            if (button.dataset.deleteReservation) {
                store.rsv.splice(Number(button.dataset.deleteReservation), 1);
                store.rsvOpen = true;
                this.showToast('Réservation annulée');
                return this.navigate('rsv');
            }
            if (button.dataset.orderMenu) {
                const menu = document.querySelector(`[data-order-actions="${button.dataset.orderMenu}"]`);
                if (!menu) return;
                document.querySelectorAll('[data-order-actions]').forEach(item => {
                    if (item !== menu) item.hidden = true;
                });
                document.querySelectorAll('[data-order-menu]').forEach(item => item.setAttribute('aria-expanded', 'false'));
                menu.hidden = !menu.hidden;
                button.setAttribute('aria-expanded', String(!menu.hidden));
                return;
            }
                        if (button.dataset.sendOrder) {
                const orderNumber = button.dataset.sendOrder;
                const code = button.dataset.code;
                
                // On trouve la commande pour récupérer ses infos complètes
                const order = store.orders.find(o => (o.number || `#${String(o.code).slice(-6).replace(/-/g, '')}`) === orderNumber);
                
                if (order) {
                    // On importe le service dynamiquement pour ne pas ralentir le chargement initial
                    import('../services/orders.js').then(async ({ ordersService }) => {
                        const result = await ordersService.sendOrder({
                            orderNumber: orderNumber,
                            code: code
                        });
                        
                        if (result === 'copied') {
                            this.showToast('Code copié dans le presse-papier');
                        } else if (result === true) {
                            this.showToast('Code envoyé avec succès');
                        }
                    });
                } else {
                    this.showToast('Commande introuvable');
                }
                return;
            }
            if (button.dataset.deleteOrder) {
                store.removeOrder(button.dataset.deleteOrder);
                return this.navigate('orders');
            }
            if (button.dataset.removeCart) {
                store.removeCartItem(Number(button.dataset.removeCart));
                this.showToast('Produit supprimé du panier');
                return this.navigate('cart');
            }
            if (button.dataset.more) {
                this.closeMore();
                return button.dataset.more === 'balance'
                    ? this.openRechargeSheet()
                    : this.navigate(button.dataset.more);
            }

            if (button.id === 'plusBtn') return this.toggleMore();
            if (button.id === 'closeSheet') {
                document.getElementById('sheet').classList.remove('open');
                document.getElementById('sheet').classList.remove('payment-sheet');
                document.body.classList.remove('recharge-open');
                return;
            }
            if (button.id === 'walletBtn') return this.openRechargeSheet();
            if (button.hasAttribute('data-close-recharge')) {
                document.getElementById('sheet').classList.remove('open');
                document.body.classList.remove('recharge-open');
                return;
            }
            if (button.hasAttribute('data-toggle-recharge-history')) {
                store.rechargeHistoryOpen = !store.rechargeHistoryOpen;
                this.renderRecharge();
                return;
            }
            if (button.hasAttribute('data-toggle-rewards-history')) {
                store.rewardHistoryOpen = !store.rewardHistoryOpen;
                this.navigate('rew');
                return;
            }
            if (button.hasAttribute('data-recharge-back')) {
                document.getElementById('sheet').classList.remove('payment-sheet');
                store.rechargeHistoryOpen = false;
                this.renderRecharge();
                return;
            }

            if (button.dataset.rechargeAmount) {
                document.querySelectorAll('[data-recharge-amount]').forEach(item => item.classList.remove('active'));
                button.classList.add('active');
                const input = document.getElementById('customRechargeAmount');
                if (input) input.value = button.dataset.rechargeAmount;
                return;
            }

            if (button.dataset.openPayment) {
                const input = document.getElementById('customRechargeAmount');
                const amount = Math.max(1, Number(input?.value) || 10);
                const asset = button.dataset.openPayment.toUpperCase();
                const existing = store.pendingRecharges.find(item => item.asset === asset && item.amount === amount && item.expiresAt > Date.now());
                if (!existing) {
                    store.pendingRecharges.unshift({
                        id: `${Date.now()}-${asset}`,
                        asset,
                        amount,
                        date: 'En attente de confirmation',
                        expiresAt: Date.now() + 3599 * 1000
                    });
                }
                document.getElementById('rechargeContent').innerHTML = renderCryptoPayment(button.dataset.openPayment, amount);
                document.getElementById('sheet').classList.add('payment-sheet');
                this.startPaymentTimer(button.dataset.openPayment, amount);
                return;
            }

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
            if (button.dataset.newOnly !== undefined) {
                store.newOnly = button.dataset.newOnly === 'true';
                return this.navigate('shop');
            }
            if (button.hasAttribute('data-close-shop-search')) {
                store.shopSearchOpen = false;
                return this.navigate('shop');
            }
            if (button.hasAttribute('data-reset-shop-filter')) {
                store.shopFilters = { origin:'', bin:'', ageMin:'', ageMax:'', bank:'', network:'', city:'' };
                store.q = '';
                store.shopSearchOpen = false;
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

            if (button.dataset.shareAffiliate) {
                const link = button.dataset.shareAffiliate;
                const shareData = {
                    title: 'Socket Market',
                    text: 'Rejoins Socket Market avec mon lien de parrainage :',
                    url: link
                };
                const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareData.text)}`;
                const telegramWebApp = window.Telegram?.WebApp;
                if (telegramWebApp?.openTelegramLink) {
                    telegramWebApp.openTelegramLink(telegramShareUrl);
                    return;
                }
                if (navigator.share) {
                    navigator.share(shareData)
                        .then(() => this.showToast('Lien partagé'))
                        .catch(() => {});
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(link)
                        .then(() => this.showToast('Lien copié'))
                        .catch(() => this.showToast(link));
                } else {
                    this.showToast(link);
                }
                return;
            }

            if (button.id === 'searchBtn') {
                store.shopSearchOpen = true;
                this.navigate('shop');
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

            if (button.hasAttribute('data-support')) {
                const subject = document.getElementById('supportSubject');
                const order = document.getElementById('supportOrder');
                const message = document.getElementById('supportMessage');
                if (!subject?.value || !message?.value.trim()) {
                    return this.showToast('Remplissez tous les champs');
                }
                const ticket = {
                    id: `#${String(Date.now()).slice(-6)}`,
                    subject: subject.value.trim(),
                    order: order?.value.trim() || '',
                    message: message.value.trim(),
                    status: 'En attente',
                    date: new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }),
                    messages: [{
                        author: 'user',
                        text: message.value.trim(),
                        time: new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
                    }]
                };
                store.supportTickets.unshift(ticket);
                store.supportNewOpen = false;
                store.supportTab = 'history';
                this.navigate('sup');
                return this.showToast('Ticket créé');
            }

            const topup = button.dataset.top;
            if (topup) {
                store.wallet += Number(topup);
                document.getElementById('sheet').classList.remove('open');
                document.body.classList.remove('recharge-open');
                this.navigate(this.currentRoute);
                return this.showToast(`${topup} € ajoutés à votre solde`);
            }
        });

        document.addEventListener('input', event => {
            if (event.target.id === 'rquantity') {
                const quantity = Math.max(1, Math.min(10, Number(event.target.value) || 1));
                const total = document.getElementById('rtotal');
                if (total) total.textContent = `${(quantity * 20).toFixed(2).replace('.', ',')} €`;
                return;
            }
            if (event.target.id === 'customRechargeAmount') {
                document.querySelectorAll('[data-recharge-amount]').forEach(item => {
                    item.classList.toggle('active', item.dataset.rechargeAmount === event.target.value);
                });
                return;
            }
            if (event.target.id !== 'q') return;
            store.q = event.target.value;
            const query = store.q.toLowerCase().trim();
            const list = store.products.filter(product => {
                const text = (product.name + ' ' + product.cat + ' ' + product.zone).toLowerCase();
                return text.includes(query)
                    && (!store.newOnly || product.isNew)
                    && (!store.shopFilters.origin || product.name === store.shopFilters.origin)
                    && (!store.shopFilters.bin || (product.card?.firstSix || '').startsWith(store.shopFilters.bin))
                    && (!store.shopFilters.bank || (product.card?.bank || '').toLowerCase().includes(store.shopFilters.bank.toLowerCase()))
                    && (!store.shopFilters.network || product.card?.network === store.shopFilters.network)
                    && (!store.shopFilters.city || (product.zone || '').toLowerCase().includes(store.shopFilters.city.toLowerCase()));
            }).slice(0, store.limit);
            document.getElementById('plist').innerHTML = list.length
                ? list.map(product => renderShopProduct(product)).join('')
                : '<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>';
        });

        document.addEventListener('submit', event => {
            if (event.target.id === 'shopSearchForm') {
                event.preventDefault();
                store.shopFilters = {
                    origin: document.getElementById('filterOrigin')?.value || '',
                    bin: document.getElementById('filterBin')?.value.trim() || '',
                    ageMin: document.getElementById('filterAgeMin')?.value || '',
                    ageMax: document.getElementById('filterAgeMax')?.value || '',
                    bank: document.getElementById('filterBank')?.value.trim() || '',
                    network: document.getElementById('filterNetwork')?.value || '',
                    city: document.getElementById('filterCity')?.value.trim() || ''
                };
                store.shopSearchOpen = false;
                this.navigate('shop');
                return;
            }
            if (event.target.id === 'supportChatForm') {
                event.preventDefault();
                const input = document.getElementById('supportChatInput');
                const text = input?.value.trim();
                if (!text) return;
                const ticket = store.supportTickets.find(item => item.id === store.supportTicketOpen);
                if (!ticket) return;
                ticket.messages ||= [{ author: 'user', text: ticket.message, time: ticket.date }];
                ticket.messages.push({
                    author: 'user',
                    text,
                    time: new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
                });
                this.navigate('sup');
                return;
            }
            if (event.target.id !== 'rsvForm') return;
            event.preventDefault();
            const submitButton = event.submitter;
            if (submitButton?.classList.contains('loading')) return;
            submitButton?.classList.add('loading');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="reservation-spinner"></span><span>Réservation en cours…</span>';
            }
            const quantity = Math.max(1, Math.min(10, Number(document.getElementById('rquantity').value) || 1));
            let ageMin = Math.max(18, Math.min(99, Number(document.getElementById('rageMin').value) || 18));
            let ageMax = Math.max(18, Math.min(99, Number(document.getElementById('rageMax').value) || 99));
            if (ageMin > ageMax) [ageMin, ageMax] = [ageMax, ageMin];
            const reservation = {
                bin: document.getElementById('rb').value.trim(),
                bank: document.getElementById('rbank').value,
                level: document.getElementById('rlevel').value,
                region: document.getElementById('rregion').value,
                ageMin,
                ageMax,
                quantity,
                total: quantity * 20,
                createdAt: Date.now(),
                status: 'pending'
            };
            setTimeout(() => {
                store.rsv.unshift(reservation);
                store.rsvOpen = true;
                this.navigate('rsv');
                this.showToast('Réservation enregistrée');
            }, 700);
        });

        document.getElementById('sheet').addEventListener('click', event => {
            if (event.target.id === 'sheet') {
                clearInterval(store.timer);
                event.currentTarget.classList.remove('open');
                event.currentTarget.classList.remove('payment-sheet');
                document.body.classList.remove('recharge-open');
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                clearInterval(store.timer);
                document.getElementById('sheet').classList.remove('open');
                document.getElementById('sheet').classList.remove('payment-sheet');
                document.body.classList.remove('recharge-open');
                this.closeMore();
            }
        });
    }
};