/* ==========================================================================
   2S0LACE — Games page logic
   Reads games-list.json, renders the grid, handles filtering + the player view.
   ========================================================================== */

const ICON_JOYSTICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M12 11.4V16"/><rect x="7" y="16" width="10" height="4.5" rx="2"/></svg>';

let ALL_GAMES = [];
let activeTag = 'all';

async function loadGames() {
  try {
    const res = await fetch('games-list.json');
    if (!res.ok) throw new Error('games-list.json responded with ' + res.status);
    const data = await res.json();
    ALL_GAMES = Array.isArray(data.games) ? data.games : [];
  } catch (err) {
    console.error('Could not load games-list.json:', err);
    ALL_GAMES = [];
  }
  buildTagRow();
  renderGrid();
  maybeOpenFromHash();
}

function allTags() {
  const set = new Set();
  ALL_GAMES.forEach(g => (g.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort();
}

function buildTagRow() {
  const row = document.getElementById('tag-row');
  if (!row) return;
  const tags = allTags();
  if (tags.length === 0) { row.style.display = 'none'; return; }

  row.innerHTML = `<button class="tag-filter active" data-tag="all">all</button>` +
    tags.map(t => `<button class="tag-filter" data-tag="${t}">${t}</button>`).join('');

  row.querySelectorAll('.tag-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag;
      row.querySelectorAll('.tag-filter').forEach(b => b.classList.toggle('active', b === btn));
      renderGrid();
    });
  });
}

function filteredGames() {
  const q = (document.getElementById('game-search')?.value || '').trim().toLowerCase();
  return ALL_GAMES.filter(g => {
    const matchesTag = activeTag === 'all' || (g.tags || []).includes(activeTag);
    const matchesQuery = !q ||
      g.title?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q) ||
      (g.tags || []).some(t => t.toLowerCase().includes(q));
    return matchesTag && matchesQuery;
  });
}

function cardTemplate(game, idx) {
  const thumb = game.thumbnail
    ? `<img src="${game.thumbnail}" alt="" loading="lazy" />`
    : ICON_JOYSTICK;

  return `
    <article class="game-card glass" data-idx="${idx}" tabindex="0" role="button" aria-label="Play ${game.title}">
      <div class="game-thumb">
        ${game.featured ? '<span class="featured-badge">featured</span>' : ''}
        ${thumb}
      </div>
      <div class="game-info">
        <h3>${game.title}</h3>
        <p>${game.description || ''}</p>
        <div class="game-tags">
          ${(game.tags || []).map(t => `<span class="chip">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function renderGrid() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  const games = filteredGames();

  if (ALL_GAMES.length === 0) {
    grid.innerHTML = `<div class="empty-state">games-list.json is empty — add a game entry to see it here.</div>`;
    return;
  }

  if (games.length === 0) {
    grid.innerHTML = `<div class="empty-state">no games match that search.</div>`;
    return;
  }

  grid.innerHTML = games.map((g, i) => cardTemplate(g, ALL_GAMES.indexOf(g))).join('');

  grid.querySelectorAll('.game-card').forEach(card => {
    const open = () => openGame(ALL_GAMES[Number(card.dataset.idx)]);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function openGame(game) {
  if (!game) return;
  document.getElementById('browse-view').style.display = 'none';
  const player = document.getElementById('player-view');
  player.classList.add('open');

  document.getElementById('player-title').textContent = game.title;
  document.getElementById('player-frame').src = game.path;
  document.getElementById('player-desc').textContent = game.description || 'No description provided.';
  document.getElementById('player-controls').textContent = game.controls || 'Not specified.';

  const tagWrap = document.getElementById('player-tags');
  tagWrap.innerHTML = (game.tags || []).map(t => `<span class="chip">${t}</span>`).join('');

  history.replaceState(null, '', '#' + slugify(game.id || game.title));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGame() {
  document.getElementById('player-frame').src = '';
  document.getElementById('player-view').classList.remove('open');
  document.getElementById('browse-view').style.display = '';
  history.replaceState(null, '', location.pathname);
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function maybeOpenFromHash() {
  const hash = location.hash.replace('#', '');
  if (!hash) return;
  const match = ALL_GAMES.find(g => slugify(g.id || g.title) === hash);
  if (match) openGame(match);
}

document.addEventListener('DOMContentLoaded', () => {
  loadGames();
  document.getElementById('game-search')?.addEventListener('input', renderGrid);
  document.getElementById('close-player')?.addEventListener('click', closeGame);
});
