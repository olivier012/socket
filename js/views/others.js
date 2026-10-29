import { store } from '../store/state.js';
import { formatMoney } from '../utils/format.js';

export function renderBalance() {
    return `
        <section id="page-balance" class="page">
            <h1 style="margin-bottom:20px;">Mon solde</h1>
            <div style="border:1px solid var(--line);border-radius:10px;padding:20px;background:var(--panel)">
                <strong style="color:var(--yellow);font-size:24px">${formatMoney(store.wallet)}</strong>
                <p style="color:var(--muted);margin-top:10px;">Gestion du solde disponible.</p>
            </div>
        </section>
    `;
}

export function renderReservation() {
    return `<section id="page-reservation" class="page"><div class="empty"><strong>Réservation</strong>Service bientôt disponible.</div></section>`;
}

export function renderAffiliate() {
    return `<section id="page-affiliate" class="page"><div class="empty"><strong>Affiliation</strong>Programme de parrainage Socket.</div></section>`;
}

export function renderSupport() {
    return `<section id="page-support" class="page"><div class="empty"><strong>Support</strong>Le support est disponible via Telegram.</div></section>`;
}