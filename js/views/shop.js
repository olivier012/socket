import { store } from '../store/state.js';
import { getIcon } from '../utils/icons.js';
import { eur } from '../utils/format.js';

// Nouveau composant HTML de la carte
export function productCardHTML(p) {
    return `<article class="card">
        <!-- En-tête : Carte + Bouton -->
        <div class="card-header">
            <div class="card-visual">
                <div class="chip"></div>
                <div class="visa-logo">VISA</div>
                <div class="card-number">44 6628</div>
            </div>
            <div class="card-action">
                <button class="btn-buy" data-add="${p.id}">
                    ${getIcon('cart')} Acheter
                </button>
                <span class="time">${p.ago}</span>
            </div>
        </div>

        <!-- Détails (Grille) -->
        <div class="card-details">
            <div>${getIcon('tag')} ${p.network || 'AMZ-PRIME'}</div>
            <div>${getIcon('wallet')} ${p.bank2 || 'BANQUE'}</div>
            <div>${getIcon('globe')} ${p.country || 'FRANCE'}</div>
            <div>${getIcon('bolt')} ${p.type || 'GOLD'}</div>
            <div>${getIcon('users')} Client - ${p.user || 'Age'}</div>
            <div>${getIcon('phone')} ${p.device || 'PC'}</div>
            <div>${getIcon('shield')} ${p.os || 'Système'}</div>
        </div>

        <!-- Prix -->
        <div class="card-price">
            <span>${eur(p.price)}</span>
            ${p.old ? `<span class="old-price">${eur(p.old)}</span>` : ''}
        </div>
    </article>`;
}

export function renderShop() {
    const q = store.q.toLowerCase().trim();
    const all = store.products.filter(p =>
        (p.name + ' ' + p.cat + ' ' + p.zone).toLowerCase().includes(q)
    );
    const list = all.slice(0, store.limit);

    return `
        <div class="top">
            <div><p>Bienvenue sur</p><h2>Socket Market</h2></div>
            <button class="wallet" id="walletBtn" aria-label="Recharger mon solde">
                ${getIcon('wallet')}<span>${eur(store.wallet)}</span>
            </button>
        </div>

        <div class="banner">
            ${store.slides.map((x, i) => `
                <div class="slide ${i === store.slide ? 'on' : ''}">
                    <div class="art" style="background:${x.c}">${x.a}</div>
                    <h3>${x.t}</h3><p>${x.p}</p>
                </div>
            `).join('')}
            <div class="dots">
                ${store.slides.map((_, i) => `<button class="${i === store.slide ? 'on' : ''}" data-slide="${i}" aria-label="Annonce ${i + 1}"></button>`).join('')}
            </div>
        </div>

        <div class="row">
            <button class="news" id="seeNew">
                <div><b>Nouvelles cartes</b><span>${store.products.length} cartes disponibles</span></div>
                <em>Voir</em>
            </button>
            <button class="sq" id="searchBtn" aria-label="Rechercher">${getIcon('search')}</button>
        </div>

        <div class="searchbar ${store.open ? 'open' : ''}" id="sbar">
            <input id="q" type="search" placeholder="Steam, Netflix, Orange…" value="${store.q.replace(/"/g, '&quot;')}">
        </div>

        <div class="view">
            <span>Affichage</span>
            ${[30, 60, 100, 0].map(n => `<button class="${store.limit === (n || 999) ? 'on' : ''}" data-limit="${n || 999}">${n || 'Tout'}</button>`).join('')}
        </div>

        <div class="list" id="plist">
            ${list.map(productCardHTML).join('') || `<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>`}
        </div>
    `;
}