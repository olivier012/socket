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
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames
            .filter(name => name.startsWith('socket-market-') && name !== 'socket-market-network-only-v33')
            .map(name => caches.delete(name)));
    } catch (error) {
        console.warn('Nettoyage du cache indisponible:', error);
    }
}

async function prepareAppUpdates() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.register('./sw.js?v=20261102-card-v33');
        registration.update().catch(() => {});
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
    const preloaderFallback = setTimeout(hidePreloader, 5000);
    try {
        clearLegacyCaches();
        prepareAppUpdates().catch(error => console.warn('Service worker indisponible:', error));
        const { router } = await import(`./routes/router.js?v=${Date.now()}`);
        try {
            telegramService.init();
        } catch (error) {
            console.warn('Initialisation Telegram limitée:', error);
        }
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
        const detail = err instanceof Error && err.message
            ? err.message
            : 'Le chargement de l’application a échoué.';
        telegramService.showError(`Erreur au démarrage : ${detail}`);
    } finally {
        // Quoi qu'il arrive, on retire le preloader
        clearTimeout(preloaderFallback);
        hidePreloader();
    }
}

startApp();