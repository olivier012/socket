import { API_CONFIG } from '../config/api.js';

export const ordersService = {
    async sendOrder(orderData) {
        const tg = window.Telegram?.WebApp;
        const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        
        // --- MÉTHODE 1 : Le backend (ACTIVÉ) ---
        if (!isLocalPreview && tg && tg.initData) {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_ORDER}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        initData: tg.initData,
                        orderId: orderData.orderNumber,
                        demoCode: orderData.code // Le backend l'utilise pour l'instant
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    tg.showAlert("✅ Code envoyé sur votre compte Telegram !");
                    return true;
                } else {
                    // Si le backend échoue, on affiche l'erreur
                    console.error("Erreur backend:", data.error);
                    tg.showAlert("❌ " + (data.error || "Erreur d'envoi."));
                    return false;
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
                tg.showAlert("⚠️ Erreur de connexion au serveur.");
                return false;
            }
        }

        // --- MÉTHODE 2 : Fallback (Hors Telegram ou Local) ---
        const shareData = { 
            title: 'Mon code cadeau Socket Market', 
            text: `Voici mon code pour la commande ${orderData.orderNumber} :\n\n${orderData.code}` 
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return true;
            } catch (e) {
                return false;
            }
        } else {
            await navigator.clipboard.writeText(orderData.code);
            return 'copied';
        }
    }
};