import { API_CONFIG } from '../config/api.js';

export const telegramService = {
    tg: window.Telegram?.WebApp,

    init() {
        if (this.tg) {
            this.tg.expand();
            this.tg.setHeaderColor('#0D0E11');
        }
    },

    async verifyUser() {
        if (!this.tg || !this.tg.initData) {
            this.showError("Veuillez ouvrir cette page depuis Telegram.");
            return false;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: this.tg.initData }),
                signal: controller.signal
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!data.authorized) {
                this.showError("Accès refusé. Retournez sur le bot Telegram et répondez aux questions via /start.");
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);
            this.showError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
            return false;
        } finally {
            clearTimeout(timer);
        }
    },

    showError(message) {
        document.body.innerHTML = `
            <div style="color:white; text-align:center; padding:50px; font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; justify-content:center; height:100vh; background:#0D0E11;">
                <h2 style="margin-bottom:10px; font-family:'Bricolage Grotesque',sans-serif;">Erreur</h2>
                <p style="color:#8E929A;">${message}</p>
            </div>
        `;
    }
};