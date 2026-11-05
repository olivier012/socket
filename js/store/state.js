export const store = {
    wallet: 24,
    limit: 30,
    q: '',
    open: false,
    shopSearchOpen: false,
    newOnly: false,
    shopFilters: {
        origin: '',
        bin: '',
        ageMin: '',
        ageMax: '',
        bank: '',
        network: '',
        city: ''
    },
    cart: [],       // [{id, qty}]
    orders: [],     // [{id, code, time}]
    rsv: [],        // [{bin, bank, level, region, ageMin, ageMax, quantity, total, createdAt, status}]
    rsvOpen: false,
    rechargeHistory: [],
    rechargeHistoryOpen: false,
    pendingRecharges: [],
    rewardHistoryOpen: false,
    supportTab: 'assistance',
    supportNewOpen: false,
    supportTicketOpen: null,
    supportTickets: [],
    slide: 2,
    timer: null,

    products: [
        { id:1, name:'Steam', cat:'jeux', value:20, price:20, color:'#C0FF15', ini:'S', zone:'France', ago:'il y a 3 min', isNew:true, card:{ bank:'BNP Paribas', network:'Visa', firstSix:'426881', image:'assets/cards/bnp-parubas.jpg', tier:'Premium' } },
        { id:2, name:'PlayStation Store', cat:'jeux', value:25, price:25, color:'#FFFFFF', ini:'P', zone:'France', ago:'il y a 7 min', isNew:true, card:{ bank:'Revolut', network:'Mastercard', firstSix:'535205', image:'assets/cards/revolut.jpg', tier:'Classic' } },
        { id:3, name:'Netflix', cat:'streaming', value:15, price:15, color:'#8E929A', ini:'N', zone:'Europe', ago:'il y a 16 min', card:{ bank:'Fortuneo', network:'Mastercard', firstSix:'554025', image:'assets/cards/fortuneo-classic.jpg', tier:'Classic' } },
        { id:4, name:'Spotify Premium', cat:'streaming', value:30, price:29, color:'#C0FF15', ini:'S', zone:'Europe', ago:'il y a 21 min', card:{ bank:'Monabanq', network:'Visa', firstSix:'497010', image:'assets/cards/monabanq-silver.jpg', tier:'Silver' } },
        { id:5, name:'Orange recharge', cat:'recharge', value:10, price:10, color:'#FFFFFF', ini:'O', zone:'Mali', ago:'il y a 28 min', card:{ bank:'UAB', network:'UnionPay', firstSix:'621094', image:'assets/cards/uab-classic.jpg', tier:'Classic' } },
        { id:6, name:'Moov Africa recharge', cat:'recharge', value:5, price:5, color:'#8E929A', ini:'M', zone:'Mali', ago:'il y a 35 min', card:{ bank:'Crédit Agricole', network:'Mastercard', firstSix:'541234', image:'assets/cards/ca.jpg', tier:'Classic' } },
        { id:7, name:'Google Play', cat:'jeux', value:50, price:48, color:'#C0FF15', ini:'G', zone:'International', ago:'il y a 42 min', card:{ bank:'Banque Populaire', network:'Visa', firstSix:'497970', image:'assets/cards/bp.jpg', tier:'Gold' } },
        { id:8, name:'Disney+', cat:'streaming', value:25, price:24, color:'#FFFFFF', ini:'D', zone:'Europe', ago:'il y a 1 h', card:{ bank:'Fortuneo', network:'Mastercard', firstSix:'554026', image:'assets/cards/fortuneo-gold.jpg', tier:'Gold' } }
    ],

    slides: [
        { t:'Cartes cadeaux officielles', p:'Codes livrés tout de suite après l’achat', c:'#C0FF15', a:'Socket' },
        { t:'Recharges téléphone', p:'Orange et Moov Africa, sans frais cachés', c:'#FFFFFF', a:'+10 €' },
        { t:'Jeux et streaming', p:'Steam, PlayStation, Netflix, Spotify', c:'#8E929A', a:'Play' }
    ],

    addToCart(id) {
        const item = this.cart.find(c => c.id === id);
        if (item) item.qty++;
        else this.cart.push({ id, qty: 1 });
        return { success: true, message: 'Ajouté au panier' };
    },

    removeFromCart(id) {
        const item = this.cart.find(c => c.id === id);
        if (item && --item.qty <= 0) {
            this.cart = this.cart.filter(c => c !== item);
        }
    },

    removeCartItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
    },

    validatePurchase() {
        const total = this.cart.reduce((s, i) => s + this.products.find(p => p.id === i.id).price * i.qty, 0);
        if (total > this.wallet) return { success: false, message: 'Solde insuffisant' };

        const purchasedAt = new Date();
        const time = purchasedAt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
        const date = purchasedAt.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
        this.cart.forEach(i => {
            for (let k = 0; k < i.qty; k++) {
                this.orders.unshift({
                    id: i.id,
                    code: this.generateCode(),
                    time,
                    date,
                    number: this.generateOrderNumber()
                });
            }
        });
        this.wallet -= total;
        this.cart = [];
        return { success: true };
    },

    removeOrder(number) {
        this.orders = this.orders.filter(order => {
            const orderNumber = order.number || `#${String(order.code).slice(-6).replace(/-/g, '')}`;
            return orderNumber !== number;
        });
    },

    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-7);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#${timestamp}${random}`;
    },

    generateCode() {
        return Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');
    }
};