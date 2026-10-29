import { store } from '../store/state.js';
import { formatMoney } from '../utils/format.js';

export function renderCart() {
    if (!store.cart.length) {
        return `
            <section id="page-cart" class="page">
                <div class="empty"><strong>Votre panier est vide</strong>Ajoutez une carte depuis la boutique.</div>
            </section>
        `;
    }

    const total = store.cart.reduce((sum, p) => sum + p.price, 0);

    const itemsHtml = store.cart.map((p, i) => `
        <article class="product-card ${p.type.toLowerCase()}" style="min-height:190px;margin-bottom:10px">
            <div class="card-head">
                <div class="chip"></div>
                <div class="visa-line"><small>VISA</small><span class="last4">${p.card}</span></div>
                <div class="price"><strong class="product-price">${p.price.toFixed(2)}€</strong></div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" data-remove="${i}">Supprimer</button>
                <button class="cart-add-btn" data-validate="${i}">Valider</button>
            </div>
        </article>
    `).join('');

    return `
        <section id="page-cart" class="page">
            ${itemsHtml}
            <div class="cart-summary">
                <div>
                    <small>Total</small>
                    <strong style="display:block;color:var(--yellow)">${formatMoney(total)}</strong>
                </div>
                <button class="validate-btn" id="validateCartBtn">Valider le panier</button>
            </div>
        </section>
    `;
}