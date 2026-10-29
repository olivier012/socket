export const store = {
    wallet: 2.80,
    cart: [],
    purchases: [],
    currentFilter: 'all',
    products: [
        { id: 1, card: '446623', network: 'AMZ-PRIME', user: 'louka', age: '18 ans', bank2: 'REVOLUT', country: 'France', device: 'iPhone', os: 'iOS 18.7', old: 15, price: 4.50, type: 'Credit', count: 30 },
        { id: 2, card: '446623', network: 'AMZ-PRIME', user: 'Rouan', age: '22 ans', bank2: 'BFDBANK, S.A.', country: 'France', device: 'iPhone', os: 'iOS 18.7', old: 15, price: 1.20, type: 'Debit', count: 60 },
        { id: 3, card: '497669', network: 'AMZ-PRIME', user: 'marie', age: '27 ans', bank2: 'CLASSIC', country: 'France', device: 'iPhone', os: 'iOS 18.7', old: 16, price: 5.20, type: 'Credit', count: 120 }
    ],

    addToCart(product) {
        const cartTotal = this.cart.reduce((sum, item) => sum + item.price, 0);
        if (product.price + cartTotal > this.wallet) {
            return { success: false, message: 'Solde portefeuille insuffisant' };
        }
        if (!this.cart.find(p => p.id === product.id)) {
            this.cart.push(product);
            return { success: true, message: 'Carte ajoutée au panier' };
        }
        return { success: false, message: 'Déjà dans le panier' };
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
    },

    validatePurchase(index = null) {
        const itemsToBuy = index !== null ? [this.cart[index]] : [...this.cart];
        const total = itemsToBuy.reduce((sum, p) => sum + p.price, 0);

        if (total > this.wallet) return { success: false };

        this.wallet -= total;
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        itemsToBuy.forEach(p => this.purchases.unshift({ ...p, time: now }));

        if (index !== null) {
            this.cart.splice(index, 1);
        } else {
            this.cart = [];
        }
        return { success: true };
    }
};