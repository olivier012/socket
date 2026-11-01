import { store } from '../store/state.js';
import { getIcon } from '../utils/icons.js';

export function renderShop() {
    const q = document.getElementById('search')?.value.toLowerCase().trim() || '';
    
    const list = store.products.filter(p => {
        const matchFilter = store.currentFilter === 'all' || String(p.count) === store.currentFilter;
        const matchSearch = `${p.card} ${p.network} ${p.user} ${p.country} ${p.type}`.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    const productsHtml = list.map(p => `
        <article class="product-card ${p.type.toLowerCase()}">
            <div class="card-head">
                <div class="chip"></div>
                <div class="visa-line"><small>VISA</small><span class="last4">${p.card}</span></div>
                <div class="price">
                    <span class="old-price">${p.old}.00€</span>
                    <strong class="product-price">${p.price.toFixed(2)}€</strong>
                </div>
            </div>
            <div class="card-meta">
                <div class="meta">${getIcon('bank')}<span>${p.network}</span></div>
                <div class="meta">${getIcon('user')}<span>${p.user}</span></div>
                <div class="meta">${getIcon('clock')}<span>${p.age}</span></div>
                <div class="meta flag"><span class="fr"></span><span>${p.country}</span></div>
                <div class="meta highlight">${getIcon('building')}<span>${p.bank2}</span></div>
                <div class="meta">${getIcon('phone')}<span>${p.device}</span></div>
                <div class="meta highlight">${getIcon('shield')}<span>${p.os}</span></div>
            </div>
            <div class="card-footer-separate">
                <div class="type-footer">${p.type} ${getIcon('time')} 13 h</div>
                <button class="add" data-id="${p.id}">+</button>
            </div>
        </article>
    `).join('') || '<div class="empty"><strong>Aucun résultat</strong>Essayez une autre recherche.</div>';

    return `
        <section id="page-shop" class="page">
            <div class="page-heading">
                <div>
                    <span>Marché disponible</span>
                    <h1>Cartes</h1>
                </div>
                <span>${list.length} résultat${list.length > 1 ? 's' : ''}</span>
            </div>
            <div class="promo-carousel" aria-label="Promotions">
                <div class="promo-track">
                    <article class="promo-slide active">
                        <img src="assets/promo-1.gif" alt="Cartes premium disponibles">
                        <div class="promo-info"><strong>Cartes Premium</strong><span>Stock renouvelé</span></div>
                    </article>
                    <article class="promo-slide">
                        <img src="assets/promo-2.gif" alt="Livraison rapide">
                        <div class="promo-info"><strong>Livraison rapide</strong><span>Accès immédiat</span></div>
                    </article>
                    <article class="promo-slide">
                        <img src="assets/promo-3.gif" alt="Offres exclusives">
                        <div class="promo-info"><strong>Offres exclusives</strong><span>Prix avantageux</span></div>
                    </article>
                </div>
                <div class="promo-dots" aria-label="Choisir une publicité">
                    <button class="promo-dot active" data-slide="0" aria-label="Publicité 1"></button>
                    <button class="promo-dot" data-slide="1" aria-label="Publicité 2"></button>
                    <button class="promo-dot" data-slide="2" aria-label="Publicité 3"></button>
                </div>
            </div>
            <div class="search-row">
                <label class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
                    <input id="search" type="search" placeholder="Filtrer les cartes..." value="${q}">
                </label>
            </div>
            <div class="products">${productsHtml}</div>
        </section>
    `;
}