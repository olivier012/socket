import { store } from '../store/state.js?v=20261102-card-v44';
import { getIcon } from '../utils/icons.js?v=20261102-card-v44';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderCart() {
    if (!store.cart.length) {
        return `<div class="page-header cart-page-header">
        <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <h1 class="title">Panier</h1>
        </div>
        <div class="empty"><b>Votre panier est vide</b>Ajoutez une carte cadeau depuis l’onglet Cartes.<br>
        <button class="buy" data-go="shop">Voir les cartes</button></div>`;
    }
    const total = store.cart.reduce((s, i) => s + store.products.find(p => p.id === i.id).price * i.qty, 0);

    return `<div class="page-header cart-page-header">
    <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
    <h1 class="title">Panier</h1>
    </div>
    <div class="list">
        ${store.cart.map(i => {
            const p = store.products.find(product => product.id === i.id);
            const card = p.card || { bank:'Unknown', network:'Unknown', firstSix:'000000', image:'', tier:'Unknown' };
            const price = eur(p.price * i.qty);
            
            return `<article class="sketch-card cart-sketch-card">
                <div class="sketch-card-header">
                    <div class="real-bank-card">
                        ${card.image ? `<img src="${card.image}" alt="Carte ${card.bank} ${card.network}" class="bank-card-image">` : ''}
                    </div>
                    <div class="card-network-info">
                        <span class="network-badge ${card.network.toLowerCase().replace(/[^a-z0-9]/g, '')}">${card.network.toUpperCase()}</span>
                        <strong class="card-bin">${card.firstSix}</strong>
                    </div>
                    <div class="cart-price-top">${price}</div>
                </div>

                <div class="sketch-card-body">
                    <div class="sketch-col-left sketch-list">
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('product')}</span><strong>${p.name}</strong></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('building')}</span><span>${card.bank.toUpperCase()}</span></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('diamond')}</span><span>${card.tier.toUpperCase()}</span></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('location')}</span><span>${p.zone.toUpperCase()}</span></div>
                    </div>
                    <div class="sketch-col-right sketch-list">
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('users')}</span><span>Client - Age</span></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('monitor')}</span><span>PC</span></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('cards')}</span><span>Système</span></div>
                        <div class="sketch-row"><span class="sketch-icon">${getIcon('location')}</span><span>Ville</span></div>
                    </div>
                </div>

                <div class="sketch-card-footer cart-card-footer">
                    ${p.isNew ? '<span class="new-badge">Nouveau</span>' : '<span></span>'}
                    <div class="cart-footer-actions">
                        <button class="cart-remove-button" data-remove-cart="${p.id}" aria-label="Supprimer ${p.name} du panier" title="Supprimer du panier">
                            ${getIcon('trash')}
                        </button>
                        <div class="cart-qty" aria-label="Quantité">
                            <button disabled aria-label="Retirer une carte">−</button>
                            <strong>${i.qty}</strong>
                            <button disabled aria-label="Ajouter une carte">+</button>
                        </div>
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