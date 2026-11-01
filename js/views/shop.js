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
            // Dans shop.js, remplacez la section <div class="promo-carousel">...</div> par :

<div class="promo-carousel" aria-label="Promotions">
    <div class="promo-track">
        <!-- Slide 1 -->
        <article class="promo-slide active">
            <div class="promo-content">
                <div class="promo-badge">%</div>
                <div class="promo-text">
                    <h3>Cartes Premium</h3>
                    <p>Disponible maintenant</p>
                </div>
                <div class="promo-card-visual">
                    <div class="mini-chip"></div>
                    <span>SOCKET</span>
                </div>
            </div>
        </article>
        <!-- Slide 2 -->
        <article class="promo-slide">
            <div class="promo-content">
                <div class="promo-badge">%</div>
                <div class="promo-text">
                    <h3>Livraison Rapide</h3>
                    <p>Disponible maintenant</p>
                </div>
                <div class="promo-card-visual">
                    <div class="mini-chip"></div>
                    <span>SOCKET</span>
                </div>
            </div>
        </article>
        <!-- Slide 3 -->
        <article class="promo-slide">
            <div class="promo-content">
                <div class="promo-badge">%</div>
                <div class="promo-text">
                    <h3>Offres Exclusives</h3>
                    <p>Disponible maintenant</p>
                </div>
                <div class="promo-card-visual">
                    <div class="mini-chip"></div>
                    <span>SOCKET</span>
                </div>
            </div>
        </article>
    </div>
    <div class="promo-dots" aria-label="Choisir une publicité">
        <button class="promo-dot active" data-slide="0"></button>
        <button class="promo-dot" data-slide="1"></button>
        <button class="promo-dot" data-slide="2"></button>
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