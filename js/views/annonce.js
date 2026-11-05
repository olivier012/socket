export const announcements = [
    {
        label: 'Nouvelles',
        title: 'Nouvelles cartes disponibles',
        description: 'Découvrez les cartes ajoutées récemment'
    },
    {
        label: 'Support',
        title: 'Service assistance & Support',
        description: 'Notre équipe écoute vos demandes'
    },
    {
        label: 'Réservation',
        title: 'Réservation disponible maintenant',
        description: 'Configurez vos critères en quelques secondes'
    }
];

export function renderAnnouncement() {
    const first = announcements[0];
    return `
        <strong>${first.label}</strong>
        <span class="announcement-copy">
            <b>${first.title}</b>
            <small>${first.description}</small>
        </span>
    `;
}

export function startAnnouncements() {
    const banner = document.getElementById('appAnnouncement');
    if (!banner) return;

    const label = banner.querySelector('strong');
    const copy = banner.querySelector('.announcement-copy');
    let current = 0;

    banner.classList.add('show');
    window.setInterval(() => {
        copy.classList.add('changing');
        window.setTimeout(() => {
            current = (current + 1) % announcements.length;
            const announcement = announcements[current];
            label.textContent = announcement.label;
            copy.innerHTML = `<b>${announcement.title}</b><small>${announcement.description}</small>`;
            banner.dataset.announcement = String(current);
            copy.classList.remove('changing');
        }, 180);
    }, 4000);
}
