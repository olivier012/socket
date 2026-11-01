import { store } from '../store/state.js';
import { getIcon } from '../utils/icons.js';

const eur = value => value.toFixed(2).replace('.', ',') + ' €';

export function renderCart() {
    if (!store.cart.length) {
        return `<h1 class="title">Panier</h1>
        <div class="empty"><b>Votre panier est vide</b>Ajoutez une carte cadeau depuis l’onglet Cartes.<br>
        <button class="buy" data-go="shop">Voir les cartes</button></div>`;
    }
    const total = store.cart.reduce((s, i) => s + store.products.find(p => p.id === i.id).price * i.qty, 0);

    return `<h1 class="title">Panier</h1>
    <div class="list">
        ${store.cart.map(i => {
            const p = store.products.find(product => product.id === i.id);
            // On génère des données factices pour coller au dessin
            const cardNumber = `44 6628`;
            const price = eur(p.price * i.qty);
            
            return `<article class="cart-visual-card">
                
                <!-- HAUT : Carte & Bouton Acheter -->
                <div class="cv-top">
                    <div class="cv-bank-card">
                        <div class="cv-card-top">
                            <span class="cv-card-logo">VISA</span>
                            <span class="cv-card-num">${cardNumber}</span>
                        </div>
                        <div class="cv-card-chip">
                            <span class="chip-line"></span>
                        </div>
                        <div class="cv-card-bottom">
                            <span class="cv-card-brand">VISA</span>
                        </div>
                    </div>
                    
                    <div class="cv-actions">
                        <button class="cv-buy-btn" data-inc="${p.id}">+ Acheter</button>
                        <div class="cv-time">il y a 16h</div>
                    </div>
                </div>

                <!-- BAS : Grille d'informations -->
                <div class="cv-info-grid">
                    <!-- Colonne 1 -->
                    <div class="cv-info-col">
                        <div class="cv-info-row"><span class="cv-icon">≡</span> ${p.name}</div>
                        <div class="cv-info-row"><span class="cv-icon">▤</span> BANQUE</div>
                        <div class="cv-info-row"><span class="cv-icon">⬟</span> GOLD</div>
                        <div class="cv-info-row"><span class="cv-icon">⌂</span> ${p.zone}</div>
                    </div>
                    
                    <!-- Colonne 2 -->
                    <div class="cv-info-col cv-info-right">
                        <div class="cv-info-row"><span class="cv-price">${price}</span></div>
                        <div class="cv-info-row"><span class="cv-icon">👤</span> Client - Age</div>
                        <div class="cv-info-row"><span class="cv-icon">🏠</span> Ville</div>
                        <div class="cv-info-row"><span class="cv-icon">💻</span> PC</div>
                        <div class="cv-info-row"><span class="cv-icon">○</span> Systeme</div>
                    </div>
                </div>

            </article>`;
        }).join('')}
    </div>
    <div class="summary">
        <div><small>Total</small><strong>${eur(total)}</strong></div>
        <button id="pay">Payer avec mon solde</button>
    </div>`;
}