
import { store } from '../store/state.js?v=20261102-card-v33';
import { getIcon } from '../utils/icons.js?v=20261102-card-v13';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';
const CAT = { jeux: 'Jeux', streaming: 'Streaming', recharge: 'Recharge téléphone' };

function productCard(p) {
    const card = p.card || { bank:'Unknown', network:'Unknown', firstSix:'000000', image:'', tier:'Unknown' };
    
    return `<article class="sketch-card">
        <div class="sketch-card-header">
            <div class="real-bank-card">
                ${card.image ? `<img src="${card.image}" alt="Carte ${card.bank} ${card.network}" class="bank-card-image">` : ''}
            </div>
            <div class="card-network-info">
                <span class="network-badge ${card.network.toLowerCase().replace(/[^a-z0-9]/g, '')}">${card.network.toUpperCase()}</span>
                <strong class="card-bin">${card.firstSix}</strong>
            </div>
            <div class="sketch-top-right">
                <button class="sketch-buy" data-add="${p.id}">+ Acheter</button>
                <div class="sketch-when">${p.ago}</div>
            </div>
        </div>

        <div class="sketch-card-body">
            <div class="sketch-col-left sketch-list">
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('product')}</span> <strong>${p.name}</strong>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('building')}</span> <span>${card.bank.toUpperCase()}</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('diamond')}</span> <span>${card.tier.toUpperCase()}</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('location')}</span> <span>${p.zone.toUpperCase()}</span>
                </div>
            </div>
            <div class="sketch-col-right sketch-list">
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('users')}</span> <span>Client - Age</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('monitor')}</span> <span>PC</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('cards')}</span> <span>Système</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">${getIcon('location')}</span> <span>Ville</span>
                </div>
            </div>
        </div>
        <div class="sketch-card-footer">
            ${p.isNew ? '<span class="new-badge">Nouveau</span>' : '<span></span>'}
            <strong class="sketch-price">${eur(p.price)}</strong>
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