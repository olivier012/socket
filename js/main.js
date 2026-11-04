import { telegramService } from './services/telegram.js?v=20261102-card-v13';

document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
document.addEventListener('gesturechange', event => event.preventDefault(), { passive: false });
document.addEventListener('gestureend', event => event.preventDefault(), { passive: false });
document.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
}, { passive: false });
document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && ['+', '=', '-', '_', '0'].includes(event.key)) {
        event.preventDefault();
    }
});

async function clearLegacyCaches() {
    if (!('caches' in window)) return;
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
        .filter(name => name.startsWith('socket-market-') && name !== 'socket-market-network-only-v19')
        .map(name => caches.delete(name)));
}

async function prepareAppUpdates() {
    await clearLegacyCaches();
    if (!('serviceWorker' in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.register('./sw.js?v=20261102-card-v19');
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