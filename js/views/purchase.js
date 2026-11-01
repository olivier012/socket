import { store } from '../store/state.js?v=20261101-socket-market-v2';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderPurchases() {
    if (!store.orders.length) {
        return `<h1 class="title">Achats</h1>
        <div class="empty"><b>Aucun achat pour l’instant</b>Vos codes apparaîtront ici après le paiement.<br>
        <button class="buy" data-go="shop">Voir les cartes</button></div>`;
    }
    return `<h1 class="title">Achats</h1>
    <div class="list">
        ${store.orders.map(o => {
            const p = store.products.find(p => p.id === o.id);
            return `<article class="card">
                <div class="logo" style="background:${p.color}">${p.ini}</div>
                <div><h4>${p.name}</h4><div class="sub">${eur(p.value)}, acheté à ${o.time}</div></div>
                <div class="price">${eur(p.price)}</div>
                <div class="code"><span>${o.code}</span><button data-copy="${o.code}">Copier</button></div>
            </article>`;
        }).join('')}
    </div>`;
}