import { telegramService } from './services/telegram.js';
import { router } from './router.js';

async function startApp() {
    // 1. Lancer le timer du préloader TOUT DE SUITE (10s max)
    const preloader = document.getElementById('preloader');
    const preloaderTimeout = setTimeout(() => {
        if (preloader) {
            preloader.classList.add('out');
            setTimeout(() => preloader.remove(), 600);
        }
    }, 10000); 

    // 2. Initialiser Telegram
    telegramService.init();

    // 3. Vérifier l'utilisateur
    let isAuthorized = false;
    try {
        isAuthorized = await telegramService.verifyUser();
    } catch (e) {
        console.error("Erreur API:", e);
        // Si l'API échoue, on autorise l'accès en mode démo (ou on affiche une erreur)
        // isAuthorized = true; // Décommente pour tester en local sans API
    }

    // 4. Si non autorisé, telegramService.showError a déjà géré l'affichage.
    if (!isAuthorized) {
        clearTimeout(preloaderTimeout);
        if (preloader) preloader.remove(); // On retire le préloader pour voir l'erreur
        return; 
    }

    // 5. Lancer l'application
    router.init();

    // 6. Si l'API répond vite, on retire le préloader avant les 10s
    clearTimeout(preloaderTimeout);
    if (preloader) {
        preloader.classList.add('out');
        setTimeout(() => preloader.remove(), 600);
    }
}

startApp();