import { telegramService } from './services/telegram.js';
import { router } from './routes/router.js';

async function startApp() {
    // 1. Initialiser Telegram
    telegramService.init();

    // 2. Vérifier la sécurité auprès du serveur VPS
    const isAuthorized = await telegramService.verifyUser();
    if (!isAuthorized) return; // Si refusé, la fonction showError a déjà affiché l'écran

    // 3. Afficher la page (enlevé l'opacité 0 du CSS)
    document.body.style.opacity = '1';

    // 4. Lancer l'application (le routeur va injecter la nav et la page boutique)
    router.init();
}

// Démarrage
startApp();