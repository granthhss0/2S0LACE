/* ==========================================================================
   2S0LACE — Shared navigation injector
   Keeps nav markup in one place across all pages.
   ========================================================================== */

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: 'index.html', icon: 'home' },
  { id: 'games', label: 'Games', href: 'games.html', icon: 'grid' },
  { id: 'media', label: 'Media', href: 'media.html', icon: 'play' },
  { id: 'settings', label: 'Settings', href: 'settings.html', icon: 'gear' },
];

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="13" rx="2.4"/><path d="M9.5 8.2v5.6l4.8-2.8-4.8-2.8Z" fill="currentColor" stroke="none"/><path d="M8 20h8"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.05 2.05 0 1 1-2.9 2.9l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56v.17a2.05 2.05 0 1 1-4.1 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.05 2.05 0 1 1-2.9-2.9l.06-.06a1.7 1.7 0 0 0 .34-1.87A1.7 1.7 0 0 0 2.79 12.5h-.17a2.05 2.05 0 1 1 0-4.1h.09A1.7 1.7 0 0 0 4.27 7.3a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.05 2.05 0 1 1 2.9-2.9l.06.06a1.7 1.7 0 0 0 1.87.34h.08A1.7 1.7 0 0 0 10.34 1.4v-.17a2.05 2.05 0 1 1 4.1 0v.09a1.7 1.7 0 0 0 1.03 1.56h.08a1.7 1.7 0 0 0 1.87-.34l.06-.06a2.05 2.05 0 1 1 2.9 2.9l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.17a2.05 2.05 0 1 1 0 4.1h-.09a1.7 1.7 0 0 0-1.56 1.03Z"/></svg>',
};

function buildNavList(activeId, isMobile) {
  return NAV_ITEMS.map(item => `
    <a class="nav-item${item.id === activeId ? ' active' : ''}" href="${item.href}">
      ${ICONS[item.icon]}
      <span>${item.label}</span>
    </a>
  `).join('');
}

function renderNav(activeId) {
  const mount = document.getElementById('nav-mount');
  if (!mount) return;

  mount.innerHTML = `
    <div class="ambient"></div>

    <nav class="sidenav" aria-label="Primary">
      <div class="sidenav-inner">
        <a href="index.html" class="wordmark" aria-label="2S0LACE home">
          2S<span class="lens"></span>LACE
        </a>
        <div class="nav-list">${buildNavList(activeId)}</div>
        <div class="nav-footer">
          <div class="status-dot-row"><span class="status-dot"></span> servers online</div>
          <div>build 0.1.0 — unblocked</div>
        </div>
      </div>
    </nav>

    <header class="topbar">
      <a href="index.html" class="wordmark" aria-label="2S0LACE home">
        2S<span class="lens"></span>LACE
      </a>
    </header>

    <nav class="bottomnav" aria-label="Primary mobile">
      ${buildNavList(activeId)}
    </nav>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  renderNav(page);
});
