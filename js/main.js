import { telegramService } from './services/telegram.js';
import { router } from './router.js';

async function startApp() {
    telegramService.init();
    const isAuthorized = await telegramService.verifyUser();
    if (!isAuthorized) return;

    router.init();

    // 10 secondes de délai avant de retirer le préloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('out');
            setTimeout(() => preloader.remove(), 600);
        }
    }, 10000); 
}

startApp();