import { telegramService } from './services/telegram.js';
import { router } from './routes/router.js?v=20261101-socket-market-v3';

function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    pre.classList.add('out');
    setTimeout(() => pre.remove(), 600);
}

async function startApp() {
    try {
        telegramService.init();
        const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        if (!isLocalPreview) {
            const ok = await telegramService.verifyUser();
            if (!ok) {
                hidePreloader();
                return;
            }
        }
        router.init();
    } catch (err) {
        console.error('Erreur au démarrage :', err);
        telegramService.showError('Une erreur est survenue au démarrage. Réessayez.');
    } finally {
        // Quoi qu'il arrive, on retire le preloader
        hidePreloader();
    }
}

startApp();