import { store } from '../store/state.js?v=20261102-card-v14';
import { getIcon } from '../utils/icons.js?v=20261102-card-v14';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderReservation() {
    const banks = [...new Set(store.products.map(p => p.card?.bank).filter(Boolean))];
    const levels = [...new Set(store.products.map(p => p.card?.tier).filter(Boolean))];
    const regions = [...new Set(store.products.map(p => p.zone).filter(Boolean))];

    return `
    <div class="page-header reservation-page-header">
        <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <div>
            <p>Critères personnalisés</p>
            <h1 class="title">Réservation</h1>
        </div>
        <button class="reservation-list-button" data-toggle-reservations aria-expanded="${store.rsvOpen ? 'true' : 'false'}" aria-label="Afficher les réservations en attente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
            ${store.rsv.length ? `<span>${store.rsv.length}</span>` : ''}
        </button>
    </div>

    <div class="reservation-list-panel ${store.rsvOpen ? 'open' : ''}" id="reservationList">
        <div class="reservation-list-heading">
            <b>Réservations en attente</b>
            <span>${store.rsv.length}</span>
        </div>
        ${store.rsv.length ? store.rsv.map((r, index) => `
            <article class="reservation-item">
                <div class="reservation-item-header">
                    <div><strong>${r.bank || 'Toutes banques'}</strong><span>${r.region || 'Toutes régions'} · niveau ${r.level || 'Tous'}</span></div>
                    <span class="pending-badge">En attente</span>
                </div>
                <div class="reservation-item-details">
                    <span>BIN <b>${r.bin || '—'}</b></span>
                    <span>Âge <b>${r.ageMin || 18}-${r.ageMax || 99}</b></span>
                    <span>Quantité <b>${r.quantity}</b></span>
                    <strong>${eur(r.total)}</strong>
                </div>
                <button class="reservation-delete" data-delete-reservation="${index}" aria-label="Annuler cette réservation">Annuler</button>
            </article>
        `).join('') : `<div class="reservation-empty">Aucune réservation en attente.</div>`}
    </div>

    <form class="reservation-form" id="rsvForm">
        <p class="reservation-intro">Choisis tes préférences, on te livre dès qu’une carte correspond.</p>

        <div class="reservation-field">
            <label for="rb">BIN</label>
            <input id="rb" name="bin" type="text" inputmode="numeric" maxlength="12" placeholder="Ex : 787800">
        </div>
        <div class="reservation-field">
            <label for="rbank">Banque</label>
            <input id="rbank" name="bank" type="text" list="reservationBanks" placeholder="Toutes les banques" autocomplete="off">
            <datalist id="reservationBanks">${banks.map(bank => `<option value="${bank}"></option>`).join('')}</datalist>
        </div>
        <div class="reservation-field">
            <label for="rlevel">Niveau</label>
            <input id="rlevel" name="level" type="text" list="reservationLevels" placeholder="Tous les niveaux" autocomplete="off">
            <datalist id="reservationLevels">${levels.map(level => `<option value="${level}"></option>`).join('')}</datalist>
        </div>
        <div class="reservation-field">
            <label for="rregion">Région</label>
            <input id="rregion" name="region" type="text" list="reservationRegions" placeholder="Toutes les régions" autocomplete="off">
            <datalist id="reservationRegions">${regions.map(region => `<option value="${region}"></option>`).join('')}</datalist>
        </div>

        <div class="reservation-age">
            <span>Âge min.</span>
            <div>
                <input id="rageMin" name="ageMin" type="number" min="18" max="99" value="18" aria-label="Âge minimum">
                <span>—</span>
                <input id="rageMax" name="ageMax" type="number" min="18" max="99" value="99" aria-label="Âge maximum">
            </div>
        </div>

        <div class="reservation-total">
            <div>
                <span>Quantité</span>
                <input id="rquantity" name="quantity" type="number" min="1" max="10" value="1" aria-label="Quantité">
            </div>
            <strong>Total à retirer</strong>
            <output id="rtotal">20,00 €</output>
        </div>
        <p class="reservation-note">NB : Non remboursable.</p>
        <button class="reservation-submit" type="submit">Réserver maintenant</button>
    </form>`;
}

export function renderAffiliate() {
    return `<h1 class="title">Affilié</h1>
    <div class="list">
        <article class="card">
            <div class="logo" style="background:var(--lime)">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M16 14.5c2.9 0 5 1.8 5 5"/></svg>
            </div>
            <div><h4>Invitez vos amis</h4><div class="sub">Gagnez 5 % sur chaque achat de vos filleuls</div></div>
            <span></span>
            <div class="code"><span>SOCKET-7K2Q</span><button data-copy="SOCKET-7K2Q">Copier</button></div>
        </article>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <article class="card stat"><div class="sub">Filleuls</div><div class="price">0</div></article>
            <article class="card stat"><div class="sub">Gains</div><div class="price">${eur(0)}</div></article>
        </div>
    </div>`;
}

export function renderRewards() {
    const pts = store.orders.length * 10, next = 100;
    return `<h1 class="title">Récompenses</h1>
    <div class="list">
        <article class="card stat">
            <div class="sub">Vos points</div><div class="price">${pts} pts</div>
            <div style="height:8px;border-radius:4px;background:var(--bg);margin-top:12px;overflow:hidden">
                <div style="height:100%;width:${Math.min(100, pts / next * 100)}%;background:var(--lime)"></div>
            </div>
            <div class="sub" style="margin-top:8px">${Math.max(0, next - pts)} pts avant votre prochain bon de 2 €</div>
        </article>
        <article class="faq"><b>Comment gagner des points ?</b><p>Chaque achat rapporte 10 points. Les points se cumulent et s’échangent contre des bons d’achat.</p></article>
    </div>`;
}

export function renderSupport() {
    return `<h1 class="title">Support</h1>
    <div class="list">
        <details class="faq"><summary>Mon code ne fonctionne pas</summary><p>Vérifiez la zone de la carte, puis copiez le code depuis l’onglet Achats sans espace. Si le problème continue, écrivez-nous.</p></details>
        <details class="faq"><summary>Quand je reçois ma carte ?</summary><p>Le code apparaît dans Achats dès que le paiement est validé.</p></details>
        <details class="faq"><summary>Comment recharger mon solde ?</summary><p>Touchez le bouton + puis Solde, et choisissez un montant.</p></details>
        <button class="buy" style="height:48px;border-radius:24px" data-support>Écrire au support</button>
    </div>`;
}

export function renderBalance() {
    return `<h1 class="title">Mon solde</h1>
    <div class="list">
        <article class="card stat">
            <div class="sub">Solde disponible</div>
            <div class="price">${eur(store.wallet)}</div>
        </article>
    </div>`;
}