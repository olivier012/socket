import { telegramService } from './services/telegram.js?v=20261101-auto-refresh-v4';

async function clearLegacyCaches() {
    if (!('caches' in window)) return;
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
        .filter(name => name.startsWith('socket-market-') && name !== 'socket-market-network-only-v4')
        .map(name => caches.delete(name)));
}

async function prepareAppUpdates() {
    await clearLegacyCaches();
    if (!('serviceWorker' in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.register('./sw.js?v=20261101-auto-refresh-v4');
        await registration.update();
    } catch (error) {
        console.warn('Mise à jour automatique non disponible:', error);
    }
}

function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    pre.classList.add('out');
    setTimeout(() => pre.remove(), 600);
}

async function startApp() {
    try {
        await prepareAppUpdates();
        const { router } = await import(`./routes/router.js?v=${Date.now()}`);
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