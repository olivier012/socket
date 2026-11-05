

import { store } from '../store/state.js?v=20261102-card-v44';
import { getIcon } from '../utils/icons.js?v=20261102-card-v44';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';
const CAT = { jeux: 'Jeux', streaming: 'Streaming', recharge: 'Recharge téléphone' };

export function renderShopProduct(p) {
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
    if (store.shopSearchOpen) {
        const filters = store.shopFilters;
        const origins = [...new Set(store.products.map(p => p.name).filter(Boolean))];
        const banks = [...new Set(store.products.map(p => p.card?.bank).filter(Boolean))];
        const networks = [...new Set(store.products.map(p => p.card?.network).filter(Boolean))];

        return `
        <div class="page-header shop-search-header">
            <button type="button" class="back-button" data-close-shop-search aria-label="Retour aux cartes">${getIcon('back')}</button>
            <h1 class="title">Recherche</h1>
            <span></span>
        </div>
        <form class="shop-search-form" id="shopSearchForm">
            <div class="shop-search-actions shop-search-actions-top">
                <button type="button" class="shop-filter-reset" data-reset-shop-filter>Réinitialiser</button>
                <button type="submit" class="shop-filter-apply">Afficher les résultats</button>
            </div>
            <div class="reservation-field">
                <label for="filterOrigin">Base d'origine</label>
                <select id="filterOrigin"><option value="">Toutes les origines</option>${origins.map(origin => `<option value="${origin}" ${filters.origin === origin ? 'selected' : ''}>${origin}</option>`).join('')}</select>
            </div>
            <div class="reservation-field">
                <label for="filterBin">BIN</label>
                <input id="filterBin" type="text" inputmode="numeric" maxlength="12" value="${filters.bin}" placeholder="Ex : 426881">
            </div>
            <div class="reservation-age">
                <span>Âge</span>
                <div><input id="filterAgeMin" type="number" min="18" max="99" value="${filters.ageMin}" placeholder="Min"><span>—</span><input id="filterAgeMax" type="number" min="18" max="99" value="${filters.ageMax}" placeholder="Max"></div>
            </div>
            <div class="reservation-field">
                <label for="filterBank">Banque</label>
                <input id="filterBank" type="text" list="shopBanks" value="${filters.bank}" placeholder="Toutes les banques" autocomplete="off">
                <datalist id="shopBanks">${banks.map(bank => `<option value="${bank}"></option>`).join('')}</datalist>
            </div>
            <div class="reservation-field">
                <label for="filterNetwork">Marque</label>
                <select id="filterNetwork"><option value="">Toutes les marques</option>${networks.map(network => `<option value="${network}" ${filters.network === network ? 'selected' : ''}>${network}</option>`).join('')}</select>
            </div>
            <div class="reservation-field">
                <label for="filterCity">Ville</label>
                <input id="filterCity" type="text" value="${filters.city}" placeholder="Ville, région...">
            </div>
        </form>`;
    }

    const q = store.q.toLowerCase().trim();
    const all = store.products.filter(p => {
        const matchesText = (p.name + ' ' + p.cat + ' ' + p.zone).toLowerCase().includes(q);
        const matchesNew = !store.newOnly || p.isNew;
        const matchesOrigin = !store.shopFilters.origin || p.name === store.shopFilters.origin;
        const matchesBin = !store.shopFilters.bin || (p.card?.firstSix || '').startsWith(store.shopFilters.bin);
        const matchesBank = !store.shopFilters.bank || (p.card?.bank || '').toLowerCase().includes(store.shopFilters.bank.toLowerCase());
        const matchesNetwork = !store.shopFilters.network || p.card?.network === store.shopFilters.network;
        const matchesCity = !store.shopFilters.city || (p.zone || '').toLowerCase().includes(store.shopFilters.city.toLowerCase());
        return matchesText && matchesNew && matchesOrigin && matchesBin && matchesBank && matchesNetwork && matchesCity;
    });
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
            <button class="${store.newOnly ? 'on' : ''}" data-new-only="${store.newOnly ? 'false' : 'true'}">Nouveau</button>
        </div>

        <div class="list" id="plist">
            ${list.map(renderShopProduct).join('') || `<div class="empty"><b>Aucun résultat</b>Essayez le nom d’une marque ou d’un opérateur.</div>`}
        </div>
    `;
}