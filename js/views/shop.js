import { store } from '../store/state.js?v=20261101-socket-market-v3';
import { getIcon } from '../utils/icons.js?v=20261101-socket-market-v3';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';
const CAT = { jeux: 'Jeux', streaming: 'Streaming', recharge: 'Recharge téléphone' };

function productCard(p) {
    return `<article class="card">
        <div class="logo" style="background:${p.color}">${p.ini}</div>
        <div class="card-main"><h4>${p.name}</h4><div class="sub">${CAT[p.cat] || p.cat}, valeur ${eur(p.value)}</div></div>
        <div class="card-actions"><button class="buy" data-add="${p.id}">+ Ajouter</button><div class="when">${p.ago}</div></div>
        <div class="info">
            <span>${getIcon('globe')}${p.zone}</span>
            <span>${getIcon('bolt')}Livraison immédiate</span>
            <span class="price">${eur(p.price)}</span>
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
            ${list.map(productCard).join('') || `<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>`}
        </div>
    `;
}