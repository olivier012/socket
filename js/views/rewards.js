import { store } from '../store/state.js?v=20261102-card-v42';
import { getIcon } from '../utils/icons.js?v=20261102-card-v42';

export function renderRewards() {
    const pts = store.orders.length * 10, next = 100;
    const dailyRewards = [
        ['J1','J1', '0,30 €', 'claimed'],
        ['J2','J2', '0,50 €', 'claimed'],
        ['J3','J3', '0,75 €', 'claimed'],
        ['J4','J4', '1 €', 'available'],
        ['J5','J5', '1,50 €', 'locked'],
        ['J6','J6', '2,50 €', 'locked'],
        ['J7','J7', '7,50 € +', 'locked']
    ];

    const header = `<div class="page-header rewards-page-header">
        <button class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <h1 class="title">Récompenses</h1>
        <button class="rewards-history-button" data-toggle-rewards-history aria-label="Historique des récompenses" aria-expanded="${store.rewardHistoryOpen}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
        </button>
    </div>`;

    if (store.rewardHistoryOpen) {
        return `${header}<div class="rewards-history">
            <div class="rewards-history-heading"><b>Historique des récompenses</b><span>3</span></div>
            ${dailyRewards.slice(0, 3).map(([day,short,amount]) => `
                <article class="rewards-history-item">
                    <span class="rewards-history-day">${short}</span>
                    <div><strong>Récompense quotidienne</strong><small>${day} de la série</small></div>
                    <span class="rewards-history-amount">+${amount}</span>
                </article>`).join('')}
        </div>`;
    }

    return `${header}
    <article class="daily-rewards-card">
        <div class="daily-rewards-heading">
            <div><b><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg> Récompense quotidienne</b><span>Reviens chaque jour pour gagner le palier</span></div>
            <div class="daily-rewards-series"><span>SERIE</span><strong>🔥 3</strong></div>
        </div>
        <div class="daily-rewards-week">
            ${dailyRewards.map(([day,short,amount,status]) => `
                <button class="daily-reward-day ${status}" aria-label="${day}, ${amount}">
                    <span>${short}</span><strong>${amount}</strong><small>${status === 'claimed' ? '✓' : status === 'locked' ? '🔒' : '👑'}</small>
                </button>`).join('')}
        </div>
    </article>
    <div class="daily-rewards-next"><span class="daily-rewards-gift">🎁</span><div><b>Prochaine récompense dans 18h51</b></div></div>
    <div class="list rewards-points">
        <article class="card stat">
            <div class="sub">Vos points</div><div class="price">${pts} pts</div>
            <div style="height:8px;border-radius:4px;background:var(--bg);margin-top:12px;overflow:hidden"><div style="height:100%;width:${Math.min(100, pts / next * 100)}%;background:var(--lime)"></div></div>
            <div class="sub" style="margin-top:8px">${Math.max(0, next - pts)} pts avant votre prochain bon de 2 €</div>
        </article>
    </div>`;
}
