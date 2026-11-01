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
        // Si on n'est pas dans Telegram
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
        // On crée un overlay au-dessus de tout, sans écraser le body
        let overlay = document.getElementById('tg-error-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tg-error-overlay';
            overlay.style.cssText = `
                position: fixed; inset: 0; z-index: 9999;
                background: #0D0E11; color: white;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 40px; text-align: center;
                font-family: 'DM Sans', sans-serif;
            `;
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = `
            <h2 style="margin-bottom:10px; font-family:'Bricolage Grotesque',sans-serif;">Erreur</h2>
            <p style="color:#8E929A; max-width:320px; line-height:1.5;">${message}</p>
        `;
    }
};