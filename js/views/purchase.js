import { store } from '../store/state.js?v=20261102-card-v14';
import { getIcon } from '../utils/icons.js?v=20261102-card-v13';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderPurchases() {
    if (!store.orders.length) {
        return `<div class="page-header purchases-page-header">
        <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <h1 class="title">Mes Achats</h1>
        </div>
        <div class="empty"><b>Aucun achat pour l’instant</b>Vos codes apparaîtront ici après le paiement.<br>
        <button class="buy" data-go="shop">Voir les cartes</button></div>`;
    }
    return `<div class="page-header purchases-page-header">
    <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
    <h1 class="title">Mes Achats</h1>
    </div>
    <div class="list">
        ${store.orders.map(o => {
            const p = store.products.find(p => p.id === o.id);
            const orderNumber = o.number || `#${String(o.code).slice(-6).replace(/-/g, '')}`;
            return `<article class="sketch-card purchase-card" data-order="${orderNumber}">
                <div class="purchase-card-header">
                    <div class="purchase-order">
                        <strong>${orderNumber}</strong>
                        <span>${o.date || 'Aujourd’hui'}${o.time ? ` · ${o.time}` : ''}</span>
                    </div>
                    <span class="delivery-badge" title="Commande livrée">${getIcon('delivered')}</span>
                    <div class="purchase-price">${eur(p.price)}</div>
                    <button class="purchase-menu-button" data-order-menu="${orderNumber}" aria-label="Menu de la commande" aria-expanded="false">${getIcon('menu')}</button>
                </div>
                <div class="purchase-card-body">
                    <div><span>Produit</span><strong>${p.name}</strong></div>
                    <div><span>Code</span><button class="purchase-code" data-copy="${o.code}" title="Copier le code">${o.code}</button></div>
                </div>
                <div class="order-menu" data-order-actions="${orderNumber}" hidden>
                    <button data-send-order="${orderNumber}" data-code="${o.code}">${getIcon('send')}<span>Envoyer</span></button>
                    <button class="delete-order" data-delete-order="${orderNumber}" data-code="${o.code}">${getIcon('trash')}<span>Supprimer</span></button>
                </div>
            </article>`;
        }).join('')}
    </div>`;
}