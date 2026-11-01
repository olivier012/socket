export const store = {
    wallet: 24,
    limit: 30,
    q: '',
    open: false,
    cart: [],       // [{id, qty}]
    orders: [],     // [{id, code, time}]
    rsv: [],        // [{id, date}]
    slide: 2,
    timer: null,

    products: [
        { id:1, name:'Steam', cat:'jeux', value:20, price:20, color:'#C0FF15', ini:'S', zone:'France', ago:'il y a 3 min' },
        { id:2, name:'PlayStation Store', cat:'jeux', value:25, price:25, color:'#FFFFFF', ini:'P', zone:'France', ago:'il y a 7 min' },
        { id:3, name:'Netflix', cat:'streaming', value:15, price:15, color:'#8E929A', ini:'N', zone:'Europe', ago:'il y a 16 min' },
        { id:4, name:'Spotify Premium', cat:'streaming', value:30, price:29, color:'#C0FF15', ini:'S', zone:'Europe', ago:'il y a 21 min' },
        { id:5, name:'Orange recharge', cat:'recharge', value:10, price:10, color:'#FFFFFF', ini:'O', zone:'Mali', ago:'il y a 28 min' },
        { id:6, name:'Moov Africa recharge', cat:'recharge', value:5, price:5, color:'#8E929A', ini:'M', zone:'Mali', ago:'il y a 35 min' },
        { id:7, name:'Google Play', cat:'jeux', value:50, price:48, color:'#C0FF15', ini:'G', zone:'International', ago:'il y a 42 min' },
        { id:8, name:'Disney+', cat:'streaming', value:25, price:24, color:'#FFFFFF', ini:'D', zone:'Europe', ago:'il y a 1 h' }
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

    validatePurchase() {
        const total = this.cart.reduce((s, i) => s + this.products.find(p => p.id === i.id).price * i.qty, 0);
        if (total > this.wallet) return { success: false, message: 'Solde insuffisant' };

        const time = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
        this.cart.forEach(i => {
            for (let k = 0; k < i.qty; k++) {
                this.orders.unshift({ id: i.id, code: this.generateCode(), time });
            }
        });
        this.wallet -= total;
        this.cart = [];
        return { success: true };
    },

    generateCode() {
        return Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');
    }
};