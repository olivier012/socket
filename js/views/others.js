import { store } from '../store/state.js?v=20261101-socket-market-v2';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderReservation() {
    return `<h1 class="title">Réservation</h1>
    <form class="rsv" id="rsvForm">
        <div><label for="rp">Carte à réserver</label>
            <select id="rp">${store.products.map(p => `<option value="${p.id}">${p.name}, ${eur(p.value)}</option>`).join('')}</select>
        </div>
        <div><label for="rd">Date souhaitée</label><input id="rd" type="date" required></div>
        <button class="buy" style="height:48px;border-radius:24px;margin-top:6px" type="submit">Réserver</button>
    </form>
    ${store.rsv.length
        ? `<div class="list" style="margin-top:18px">${store.rsv.map(r => {
            const p = store.products.find(p => p.id === r.id);
            return `<article class="card">
                <div class="logo" style="background:${p.color}">${p.ini}</div>
                <div><h4>${p.name}</h4><div class="sub">Pour le ${r.date}</div></div>
                <div class="price">${eur(p.price)}</div>
            </article>`;
        }).join('')}</div>`
        : `<div class="empty" style="padding-top:36px"><b>Aucune réservation</b>Réservez une carte pour la recevoir à la date choisie.</div>`}`;
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