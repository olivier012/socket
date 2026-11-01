import { store } from '../store/state.js';
import { eur } from '../utils/format.js';

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
            const p = store.products.find(p => p.id === i.id);
            return `<article class="card">
                <div class="logo" style="background:${p.color}">${p.ini}</div>
                <div><h4>${p.name}</h4><div class="sub">${eur(p.price)} l’unité</div></div>
                <div class="qty">
                    <button data-dec="${p.id}" aria-label="Retirer une unité">−</button>
                    <b>${i.qty}</b>
                    <button data-inc="${p.id}" aria-label="Ajouter une unité">+</button>
                </div>
            </article>`;
        }).join('')}
    </div>
    <div class="summary">
        <div><small>Total</small><strong>${eur(total)}</strong></div>
        <button id="pay">Payer avec mon solde</button>
    </div>`;
}