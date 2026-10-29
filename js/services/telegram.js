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
        // La page est cachée par défaut dans le CSS (opacity: 0)
        
        if (!this.tg || !this.tg.initData) {
            this.showError("Veuillez ouvrir cette page depuis Telegram.");
            return false;
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: this.tg.initData })
            });
            
            const data = await response.json();
            
            if (!data.authorized) {
                this.showError("Accès refusé. Retournez sur le bot Telegram et répondez aux questions via /start.");
                return false;
            }
            
            return true;
            
        } catch (error) {
            this.showError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
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