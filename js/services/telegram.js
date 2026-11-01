import { API_CONFIG } from '../config/api.js';

export const telegramService = {
    tg: window.Telegram?.WebApp,

    init() {
        if (this.tg) {
            this.tg.expand();
            this.tg.setHeaderColor('#08070c');
        }
    },

       async verifyUser() {
        // --- MODE TEST LOCAL ---
        // Si pas de Telegram, on simule une connexion réussie pour voir le design
        if (!this.tg || !this.tg.initData) {
            console.warn("Mode hors-ligne : Simulation de connexion.");
            return true; // <--- Autorise l'accès pour tester
        }
        // -----------------------

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: this.tg.initData })
            });
            
            const data = await response.json();
            if (!data.authorized) {
                this.showError("Accès refusé.");
                return false;
            }
            return true;
        } catch (error) {
            this.showError("Erreur de connexion au serveur.");
            return false;
        }
    },
    showError(message) {
        document.body.innerHTML = `
            <div style="color:white; text-align:center; padding:50px; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; height:100vh; background:#08070c;">
                <h2 style="margin-bottom:10px;">Erreur</h2>
                <p style="color:#aaa3b5;">${message}</p>
            </div>
        `;
        document.body.style.opacity = '1';
    }
};