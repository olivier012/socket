import { telegramService } from './services/telegram.js';
import { router } from './routes/router.js';

async function startApp() {
    document.body.classList.add('is-loading');

    // 1. Initialiser Telegram
    telegramService.init();

    // 2. Vérifier la sécurité auprès du serveur VPS
    const isAuthorized = await telegramService.verifyUser();
    if (!isAuthorized) return; // Si refusé, la fonction showError a déjà affiché l'écran

    // 3. Lancer l'application, puis libérer le preloader
    router.init();
    requestAnimationFrame(() => {
        document.body.classList.remove('is-loading');
        const preloader = document.getElementById('preloader');
        preloader?.classList.add('is-leaving');
        setTimeout(() => preloader?.remove(), 500);
    });
}

// Démarrage
startApp();