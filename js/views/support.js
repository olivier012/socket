
import { store } from '../store/state.js?v=20261102-card-v44';
import { getIcon } from '../utils/icons.js?v=20261102-card-v44';

export function renderSupport() {
    if (store.supportTicketOpen) {
        const ticket = store.supportTickets.find(item => item.id === store.supportTicketOpen);
        if (ticket) {
            return `<div class="support-chat-page">
                <div class="page-header support-page-header">
                    <button type="button" class="back-button" data-support-chat-close onclick="window.supportAction?.('closeChat')" aria-label="Retour aux tickets">${getIcon('back')}</button>
                    <div class="support-chat-title">
                        <h1 class="title">${ticket.subject}</h1>
                        <span>${ticket.id} · ${ticket.status}</span>
                    </div>
                    <span></span>
                </div>
                <div class="support-chat-info">
                    <span>Commande</span>
                    <strong>${ticket.order || 'Aucune commande'}</strong>
                </div>
                <div class="support-chat-messages" id="supportChatMessages">
                    ${(ticket.messages || [{ text: ticket.message, time: ticket.date, author: 'user' }]).map(message => `
                        <article class="support-chat-message ${message.author === 'agent' ? 'agent' : 'user'}">
                            <p>${message.text}</p>
                            <time>${message.time}</time>
                        </article>`).join('')}
                </div>
                <form class="support-chat-composer" id="supportChatForm">
                    <input id="supportChatInput" type="text" maxlength="1000" placeholder="Écrire un message..." autocomplete="off">
                    <button type="submit" aria-label="Envoyer le message">${getIcon('send')}</button>
                </form>
            </div>`;
        }
        store.supportTicketOpen = null;
    }

    if (store.supportNewOpen) {
        const commands = [
            ...store.orders.map(order => {
                const number = order.number || `#${String(order.code).slice(-6).replace(/-/g, '')}`;
                return { value: `${number} - Achat`, label: `${number} - Achat` };
            }),
            ...store.rechargeHistory.map(item => ({
                value: `Recharge ${item.asset} - ${item.amount.toFixed(2)} €`,
                label: `Recharge ${item.asset} - ${item.amount.toFixed(2)} €`
            })),
            ...store.pendingRecharges.map(item => ({
                value: `Recharge ${item.asset} - ${item.amount.toFixed(2)} € - En attente`,
                label: `Recharge ${item.asset} - ${item.amount.toFixed(2)} € - En attente`
            }))
        ];
        const uniqueCommands = commands.filter((item, index, list) => list.findIndex(command => command.value === item.value) === index);

        return `<div class="page-header support-page-header">
            <button type="button" class="back-button" data-support-new-close onclick="window.supportAction?.('close')" aria-label="Retour au support">${getIcon('back')}</button>
            <h1 class="title">Nouveau ticket</h1>
            <span></span>
        </div>
        <div class="support-new-form">
            <label for="supportSubject">Sujet</label>
            <select id="supportSubject">
                <option value="" selected disabled>Choisissez un sujet</option>
                <option value="Probleme avec un article">Probleme avec un article</option>
                <option value="Probleme de paiement">Probleme de paiement</option>
                <option value="Autre probleme">Autre probleme</option>
            </select>
            <label for="supportOrder">Commande en question</label>
            ${uniqueCommands.length ? `
                <input id="supportOrder" type="text" list="supportCommands" placeholder="Rechercher une commande..." autocomplete="off">
                <datalist id="supportCommands">${uniqueCommands.map(command => `<option value="${command.label}"></option>`).join('')}</datalist>
            ` : `
                <div class="support-no-command">
                    <b>Aucune commande disponible</b>
                    <span>Vous pourrez ajouter une commande après un achat ou une recharge.</span>
                </div>
            `}
            <label for="supportMessage">Votre message</label>
            <textarea id="supportMessage" rows="8" maxlength="1000" placeholder="Décris-nous ta question ou ton problème..."></textarea>
            <button type="button" class="support-submit" data-support>Créer le ticket</button>
        </div>`;
    }

    const header = `<div class="page-header support-page-header">
        <button type="button" class="back-button" data-go="shop" aria-label="Retour aux cartes">${getIcon('back')}</button>
        <h1 class="title">Support</h1>
        <span></span>
    </div>
    <div class="support-intro">
        <p>Besoin d'aide ? Faites-nous connaître votre souci.</p>
    </div>
    <div class="support-tabs" role="tablist">
        <button type="button" class="${store.supportTab === 'assistance' ? 'active' : ''}" data-support-tab="assistance" onclick="window.supportAction?.('assistance')" role="tab" aria-selected="${store.supportTab === 'assistance'}">Assistance</button>
        <button type="button" class="${store.supportTab === 'history' ? 'active' : ''}" data-support-tab="history" onclick="window.supportAction?.('history')" role="tab" aria-selected="${store.supportTab === 'history'}">Historique</button>
        <button type="button" class="${store.supportTab === 'policy' ? 'active' : ''}" data-support-tab="policy" onclick="window.supportAction?.('policy')" role="tab" aria-selected="${store.supportTab === 'policy'}">Politique</button>
    </div>`;

    if (store.supportTab === 'policy') {
        return `${header}<div class="support-policy">
            <section class="support-conditions">
                <h2>Questions sur l’application</h2>
                <div class="support-faq-list">
                    <details open><summary>Comment acheter une carte ?</summary><p>Choisissez une carte, ajoutez-la au panier puis validez le paiement avec le solde disponible.</p></details>
                    <details><summary>Comment recharger mon solde ?</summary><p>Ouvrez Solde, choisissez un montant et la crypto souhaitée pour lancer le paiement de démonstration.</p></details>
                    <details><summary>Comment réserver une carte ?</summary><p>Dans Réservation, indiquez vos préférences de banque, niveau, région, âge et quantité.</p></details>
                    <details><summary>Comment utiliser mes récompenses ?</summary><p>Votre série quotidienne se débloque jour après jour dans la section Récompenses.</p></details>
                    <details><summary>Comment fonctionne mon lien affilié ?</summary><p>Partagez votre lien personnel avec Telegram. Les filleuls et gains apparaissent dans la partie Affilié.</p></details>
                    <details><summary>Comment contacter le support ?</summary><p>Sélectionnez « Créer un ticket », choisissez un sujet et indiquez la commande concernée si possible.</p></details>
                </div>
            </section>
        </div>`;
    }

    if (store.supportTab === 'history') {
        return `${header}<div class="support-history">
            <button type="button" class="support-create-link" data-support-new onclick="window.supportAction?.('new')">
                <span>Créer un ticket</span><b aria-hidden="true">→</b>
            </button>
            ${store.supportTickets.length ? store.supportTickets.map(ticket => `
                <button type="button" class="support-ticket" data-open-support-ticket="${ticket.id}">
                    <div><span>${ticket.id}</span><small>${ticket.date}</small></div>
                    <strong>${ticket.subject}</strong>
                    ${ticket.order ? `<span class="support-ticket-order">${ticket.order}</span>` : ''}
                    <p>${ticket.message}</p>
                    <span class="support-status">${ticket.status}</span>
                </button>`).join('') : `<div class="support-empty"><b>Aucune demande</b><span>Vos tickets créés apparaîtront ici.</span></div>`}
        </div>`;
    }

    return `${header}<div class="support-assistance">
        <button type="button" class="support-create-link" data-support-new onclick="window.supportAction?.('new')">
            <span>Créer un ticket</span><b aria-hidden="true">→</b>
        </button>
        <section class="support-conditions">
            <h2>Conditions de remboursement</h2>
            <div class="support-faq-list">
                <details open><summary>Demandes dans les 5 minutes suivant l'achat.</summary></details>
                <details><summary>Uniquement articles défectueux ou invalides.</summary></details>
                <details><summary>Une preuve peut être demandée.</summary></details>
                <details><summary>Remboursement sur solde boutique uniquement.</summary></details>
                <details><summary>Abus répétés = bannissement.</summary></details>
            </div>
        </section>
    </div>`;
}
