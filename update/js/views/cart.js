import { store } from '../store/state.js?v=20261101-socket-market-v3';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderCart() {
    if (!store.cart.length) {
        return `<h1 class="title">Panier</h1>
        <div class="empty"><b>Votre panier est vide</b>Ajoutez une carte cadeau depuis l’onglet Cartes.<br>
        <button class="buy" data-go="shop">Voir les cartes</button></div>`;
    }
    const total = store.cart.reduce((s, i) => s + store.products.find(p => p.id === i.id).price * i.qty, 0);

    return `<h1 class="title">Panier</h1>
    <div class="list">
        ${store.cart.map(i => {
            const p = store.products.find(product => product.id === i.id);
            const brand = p.name === 'Steam' ? '44 6628' : String(p.id + 446620);
            const displayName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'client';
            return `<article class="cart-product">
                <div class="cart-card-head">
                    <div class="cart-card-brand">
                        <span class="cart-mini-chip"></span>
                        <div><small>CARTE</small><strong>${p.ini}<span>ISA</span></strong></div>
                    </div>
                    <div class="cart-card-number">${brand}</div>
                    <button class="cart-remove" data-dec="${p.id}" aria-label="Retirer une unité">×</button>
                </div>

                <div class="cart-card-body">
                    <div class="cart-card-line"><span>Réseau</span><strong>${p.name}</strong></div>
                    <div class="cart-card-line"><span>Zone</span><strong>${p.zone}</strong></div>
                    <div class="cart-card-line"><span>Client</span><strong>${displayName}</strong></div>
                    <div class="cart-card-line"><span>Catégorie</span><strong>${p.cat}</strong></div>
                </div>

                <div class="cart-card-footer">
                    <div class="cart-card-price"><small>Prix</small><strong>${eur(p.price * i.qty)}</strong></div>
                    <div class="qty cart-qty" aria-label="Quantité">
                        <button data-dec="${p.id}" aria-label="Retirer une unité">−</button>
                        <b>${i.qty}</b>
                        <button data-inc="${p.id}" aria-label="Ajouter une unité">+</button>
                    </div>
                </div>
            </article>`;
        }).join('')}
    </div>
    <div class="summary">
        <div><small>Total</small><strong>${eur(total)}</strong></div>
        <button id="pay">Payer avec mon solde</button>
    </div>`;
}