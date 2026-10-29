import { store } from '../store/state.js';

export function renderPurchases() {
    if (!store.purchases.length) {
        return `
            <section id="page-purchase" class="page">
                <div class="empty"><strong>Aucun achat</strong>Vos cartes validées apparaîtront ici.</div>
            </section>
        `;
    }

    const itemsHtml = store.purchases.map(p => `
        <article class="product-card ${p.type.toLowerCase()}" style="min-height:190px;margin-bottom:10px">
            <div class="card-head">
                <div class="chip"></div>
                <div class="visa-line"><small>VISA</small><span class="last4">${p.card}</span></div>
                <div class="price"><strong class="product-price">${p.price.toFixed(2)}€</strong></div>
            </div>
            <div class="cart-item-actions">
                <span class="validate-btn" style="display:flex;align-items:center;height:38px">Validé • ${p.time}</span>
            </div>
        </article>
    `).join('');

    return `<section id="page-purchase" class="page">${itemsHtml}</section>`;
}