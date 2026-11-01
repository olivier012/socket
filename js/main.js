import { telegramService } from './services/telegram.js';
import { router } from './router.js';

function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    pre.classList.add('out');
    setTimeout(() => pre.remove(), 600);
}

async function startApp() {
    try {
        telegramService.init();
        const ok = await telegramService.verifyUser();
        if (!ok) return;
        router.init();
    } catch (err) {
        console.error('Erreur au démarrage :', err);
        telegramService.showError('Une erreur est survenue au démarrage. Réessayez.');
        return;
    }
    hidePreloader();
}

startApp();