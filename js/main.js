import { telegramService } from './services/telegram.js';
import { router } from './routes/router.js';

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.classList.add('out');
    setTimeout(() => preloader.remove(), 600);
}

async function startApp() {
    telegramService.init();

    // Sécurité: aucune vérification ne peut garder le loader plus de 5 secondes.
    const verification = telegramService.verifyUser();
    const timeout = new Promise(resolve => setTimeout(() => resolve(false), 4400));
    const isAuthorized = await Promise.race([verification, timeout]);

    if (isAuthorized) router.init();

    // Laisser une petite transition de 600 ms hors du délai maximal de 5 secondes.
    removePreloader();
}

startApp();