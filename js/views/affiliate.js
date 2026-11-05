
import { getIcon } from '../utils/icons.js?v=20261102-card-v44';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderAffiliate() {
    const referralLink = 'https://t.me/le_socket_bot?start=ref_SH4PV62R';
    return `<div class="page-header affiliate-page-header">
        <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <h1 class="title">Affilié</h1>
        <span></span>
    </div>
    <div class="list">
        <article class="affiliate-card">
            <div class="affiliate-card-head">
                <div class="logo affiliate-logo" style="background:var(--lime)">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M16 14.5c2.9 0 5 1.8 5 5"/></svg>
                </div>
                <div><h4>Invitez vos amis</h4><div class="sub">Gagnez 5 % sur chaque achat de vos filleuls</div></div>
            </div>
            <label class="affiliate-link-label">Votre lien de parrainage</label>
            <div class="affiliate-link-box">
                <span>${referralLink}</span>
                <button data-copy="${referralLink}" aria-label="Copier le lien">${getIcon('cards')}</button>
            </div>
            <button class="affiliate-share-button" data-share-affiliate="${referralLink}">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 11l8-5M8 13l8 5"/></svg>
                Partager
            </button>
        </article>
        <div class="affiliate-stats">
            <article class="card stat"><div class="sub">Filleuls</div><div class="price">0</div></article>
            <article class="card stat"><div class="sub">Gains</div><div class="price">${eur(0)}</div></article>
        </div>
    </div>`;
}
