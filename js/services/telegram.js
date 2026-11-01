const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);
try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_USER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: this.tg.initData }),
        signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.authorized) {
        this.showError("Accès refusé. Retournez sur le bot Telegram et répondez aux questions via /start.");
        return false;
    }
    return true;
} catch (error) {
    console.error(error);
    this.showError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    return false;
} finally {
    clearTimeout(timer);
}