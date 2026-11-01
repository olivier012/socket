import { store } from '../store/state.js?v=20261101-socket-market-v4';
import { getIcon } from '../utils/icons.js?v=20261101-socket-market-v4';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';
const CAT = { jeux: 'Jeux', streaming: 'Streaming', recharge: 'Recharge téléphone' };

function productCard(p) {
    const cardNum = `44 ${6262 + p.id}`;
    
    return `<article class="sketch-card">
        
        <!-- COLONNE GAUCHE -->
        <div class="sketch-col-left">
            
            <!-- CARTE BANCAIRE DESIGN PREMIUM -->
            <div class="real-visa-card">
                <div class="visa-top">
                    <div class="visa-chip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="6" width="18" height="12" rx="2"/>
                            <path d="M3 10h18M7 6v12M17 6v12"/>
                        </svg>
                    </div>
                    <span class="visa-logo">VISA</span>
                </div>
                <div class="visa-bottom">
                    <span class="visa-num">•••• •••• •••• ${cardNum}</span>
                </div>
            </div>

            <!-- Les infos à gauche -->
            <div class="sketch-list">
                <div class="sketch-row">
                    <span class="sketch-icon">▤</span> <strong>${p.name}</strong>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">≡</span> <span>BANQUE</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">⬟</span> <span>GOLD</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">⌂</span> <span>${p.zone.toUpperCase()}</span>
                </div>
            </div>
        </div>

        <!-- COLONNE DROITE -->
        <div class="sketch-col-right">
            <!-- Bouton + Acheter et temps -->
            <div class="sketch-top-right">
                <button class="sketch-buy" data-add="${p.id}">+ Acheter</button>
                <div class="sketch-when">${p.ago}</div>
            </div>

            <!-- Prix -->
            <div class="sketch-price">${eur(p.price)}</div>

            <!-- Infos à droite -->
            <div class="sketch-list">
                <div class="sketch-row">
                    <span class="sketch-icon">👤</span> <span>Client - Age</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">⌂</span> <span>Ville</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">▢</span> <span>PC</span>
                </div>
                <div class="sketch-row">
                    <span class="sketch-icon">○</span> <span>Système</span>
                </div>
            </div>
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