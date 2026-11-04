import { API_CONFIG } from '../config/api.js';

export const telegramService = {
    tg: window.Telegram?.WebApp,

    init() {
        this.tg = window.Telegram?.WebApp || this.tg;
        if (this.tg) {
            this.tg.expand();
            this.tg.setHeaderColor('#0D0E11');
        }
    },

    async waitForTelegram(timeoutMs = 3000) {
        const startedAt = Date.now();
        while (!window.Telegram?.WebApp && Date.now() - startedAt < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.tg = window.Telegram?.WebApp || null;
        return this.tg;
    },

    async verifyUser() {
        const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        if (isLocalPreview) return true;

        await this.waitForTelegram();

        // Si on n'est pas dans Telegram
        if (!this.tg || !this.tg.initData) {
            console.info("Application ouverte hors de Telegram: démarrage en mode navigateur.");
            return true;
        }

        console.log("Envoi de la requête à:", `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: this.tg.initData }),
                signal: controller.signal
            });

            console.log("Réponse du serveur status:", response.status);

            if (!response.ok) {
                // On lit le corps de la réponse pour voir l'erreur exacte du serveur
                const errorText = await response.text();
                throw new Error(`Erreur Serveur (${response.status}) : ${errorText}`);
            }

            const data = await response.json();
            if (!data.authorized) {
                this.showError("Accès refusé. Retournez sur le bot Telegram et répondez aux questions via /start.");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Erreur attrapée :", error);
            
            // Si le serveur met trop de temps à répondre (CORS bloqué, etc.)
            if (error.name === 'AbortError') {
                this.showError("Le serveur met trop de temps à répondre (Timeout). Vérifiez votre connexion.");
            } else {
                // On affiche le VRAI message d'erreur à l'écran
                this.showError(`Détail : ${error.message}`);
            }
            return false;
        } finally {
            clearTimeout(timer);
        }
    },

    showError(message) {
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
            <p style="color:#8E929A; max-width:320px; line-height:1.5; font-size: 14px;">${message}</p>
        `;
    }
};