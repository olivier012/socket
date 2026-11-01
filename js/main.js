import { telegramService } from './services/telegram.js';
import { router } from './router.js';

async function startApp() {
    // 1. Initialiser Telegram
    telegramService.init();

    // 2. Vérifier l'utilisateur auprès du serveur VPS
    const isAuthorized = await telegramService.verifyUser();
    if (!isAuthorized) return;

    // 3. Lancer l'application
    router.init();

    // 4. Retirer le preloader
    requestAnimationFrame(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('out');
            setTimeout(() => preloader.remove(), 600);
        }
    });
}

startApp();