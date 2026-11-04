import { store } from '../store/state.js?v=20261102-card-v14';
import { getIcon } from '../utils/icons.js?v=20261102-card-v14';

function renderRechargeForm() {
    const currentBalance = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(store.wallet);

    return `
    <div class="recharge-intro">
        <h2>Recharger mon solde</h2>
        <p>Choisissez un montant à ajouter à votre portefeuille.</p>
    </div>
    <div class="current-balance">
        <span>Solde actuel</span>
        <strong>${currentBalance}</strong>
    </div>
    <p class="recharge-label">Choisissez un montant</p>
    <div class="amounts" id="amounts">
        ${[10, 20, 50, 100].map((amount, index) => `<button class="${index === 0 ? 'active' : ''}" data-recharge-amount="${amount}">${amount}€</button>`).join('')}
    </div>
    <label class="custom-amount" for="customRechargeAmount">
        <span>Montant personnalisé</span>
        <input id="customRechargeAmount" type="number" min="1" step="0.01" value="10" inputmode="decimal">
        <b>€</b>
    </label>
    <div class="crypto-heading">
        <span>Choisir un crypto</span>
        <span>Réseau</span>
    </div>
    <div class="crypto-list">
        ${[
            ['ETH','Ethereum','ETHEREUM','eth'],
            ['USDT','Tether','ERC-20 / TRC-20','usdt'],
            ['USDC','USD Coin','Ethereum / Solana','usdc'],
            ['DAI','DAI','Ethereum','dai'],
            ['BTC','Bitcoin','Bitcoin','btc'],
            ['LTC','Litecoin','Litecoin','ltc'],
            ['SOL','Solana','Solana','sol']
        ].map(([symbol,name,network,id]) => `
            <button class="crypto-row" data-open-payment="${id}">
                <span class="crypto-icon crypto-${id}">${symbol === 'ETH' ? '◆' : symbol === 'BTC' ? '₿' : symbol === 'SOL' ? '◎' : symbol[0]}</span>
                <span class="crypto-name"><strong>${symbol}</strong><small>${name}</small></span>
                <span class="crypto-network">${network}</span>
                <span class="crypto-arrow">›</span>
            </button>`).join('')}
    </div>`;
}

function renderRechargeHistory() {
    const pending = store.pendingRecharges.map(item => {
        const remainingSeconds = Math.max(0, Math.ceil((item.expiresAt - Date.now()) / 1000));
        const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const seconds = String(remainingSeconds % 60).padStart(2, '0');
        return `<article class="recharge-history-item recharge-history-pending" data-pending-recharge="${item.id}">
            <span class="crypto-icon crypto-${item.asset.toLowerCase()}">${item.asset[0]}</span>
            <div><strong>${item.asset} · ${item.amount.toFixed(2)} €</strong><small>${item.date}</small></div>
            <span class="recharge-history-status recharge-history-pending-status">En attente <em data-recharge-history-timer="${item.id}">${minutes}:${seconds}</em></span>
        </article>`;
    }).join('');

    return `<div class="recharge-history">
        <div class="recharge-history-heading">
            <b>Historique des recharges</b>
            <span>${store.pendingRecharges.length + store.rechargeHistory.length}</span>
        </div>
        ${pending}
        ${store.rechargeHistory.length ? store.rechargeHistory.map(item => `
            <article class="recharge-history-item">
                <span class="crypto-icon crypto-${item.asset.toLowerCase()}">${item.asset[0]}</span>
                <div><strong>${item.asset} · ${item.amount.toFixed(2)} €</strong><small>${item.date}</small></div>
                <span class="recharge-history-status">Terminée</span>
            </article>
        `).join('') : `<div class="recharge-history-empty">Aucune recharge effectuée.</div>`}
    </div>`;
}

export function renderRechargeSelection() {
    return `<div class="page-header recharge-page-header">
        <button class="back-button recharge-back" data-close-recharge aria-label="Retour">${getIcon('back')}</button>
        <h1 class="title">Solde</h1>
        <button class="recharge-history-button" data-toggle-recharge-history aria-label="Historique des recharges" aria-expanded="${store.rechargeHistoryOpen}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
            ${(store.pendingRecharges.length + store.rechargeHistory.length) ? `<span>${store.pendingRecharges.length + store.rechargeHistory.length}</span>` : ''}
        </button>
    </div>
    ${store.rechargeHistoryOpen ? renderRechargeHistory() : renderRechargeForm()}`;
}

export function renderCryptoPayment(assetId, amount) {
    const assets = {
        eth: ['ETH','Ethereum','ETHEREUM','DEMO-WALLET-ETH'],
        usdt:['USDT','Tether','USDT / ERC-20','DEMO-WALLET-USDT'],
        usdc:['USDC','USD Coin','USDC / ERC-20','DEMO-WALLET-USDC'],
        dai:['DAI','DAI','DAI / ERC-20','DEMO-WALLET-DAI'],
        btc:['BTC','Bitcoin','BITCOIN','DEMO-WALLET-BTC'],
        ltc:['LTC','Litecoin','LITECOIN','DEMO-WALLET-LTC'],
        sol:['SOL','Solana','SOLANA','DEMO-WALLET-SOL']
    };
    const [symbol,name,network,address] = assets[assetId] || assets.eth;
    const cryptoAmount = symbol === 'ETH' ? (amount / 2017.55).toFixed(6) : symbol === 'BTC' ? (amount / 55248).toFixed(6) : (amount / 1).toFixed(6);
    return `<div class="page-header payment-page-header">
        <button class="back-button payment-back" data-recharge-back aria-label="Retour">${getIcon('back')}</button>
        <h1 class="title">Recharge ${amount.toFixed(2)}€</h1>
        <button class="payment-close" id="closeSheet" aria-label="Fermer">×</button>
    </div>
    <div class="payment-status"><span></span><b>En attente de paiement</b><em id="paymentTimer">59:59</em></div>
    <div class="payment-info">
        <strong class="demo-banner">APERÇU DÉMONSTRATION — aucun transfert réel</strong>
        <div class="payment-qr" aria-label="QR code de démonstration">${renderDemoQr()}</div>
        <div class="payment-network"><b>${symbol}</b><span>—</span><strong>${network}</strong></div>
        <div class="payment-divider"></div>
        <label>MONTANT À ENVOYER</label>
        <div class="payment-amount"><strong>${cryptoAmount}</strong><span>${symbol}</span><button data-copy="${cryptoAmount}" aria-label="Copier le montant">${getIcon('cards')}</button></div>
        <label>ADRESSE ${network}</label>
        <div class="payment-address"><strong>${address}</strong><button data-copy="${address}" aria-label="Copier l’adresse">${getIcon('cards')}</button></div>
    </div>`;
}

function renderDemoQr() {
    const cells = [
        1,1,1,1,1,0,1,0,1,1,1,1,1,
        1,0,0,0,1,0,1,0,1,0,0,0,1,
        1,0,1,0,1,1,0,1,1,0,1,0,1,
        1,0,0,0,1,0,1,0,1,0,0,0,1,
        1,1,1,1,1,0,1,0,1,1,1,1,1,
        0,0,0,0,0,0,1,0,0,0,0,0,0,
        1,1,0,1,0,1,1,1,0,1,1,0,1,
        0,1,1,0,1,0,1,0,1,0,1,1,0,
        1,0,1,1,1,0,0,1,1,1,0,1,1,
        1,1,0,0,1,1,1,0,0,1,1,0,1,
        1,0,1,1,0,1,0,1,1,0,1,1,1,
        1,0,0,0,1,0,1,0,0,0,1,0,1,
        1,1,1,1,1,0,1,0,1,1,1,1,1
    ];
    return `<svg viewBox="0 0 13 13" role="img">${cells.map((cell,index) => cell ? `<rect x="${index % 13}" y="${Math.floor(index / 13)}" width="1" height="1"/>` : '').join('')}</svg>`;
}
