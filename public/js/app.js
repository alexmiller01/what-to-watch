(function () {
  'use strict';

  const GENRES = [
    'Thriller', 'Drama', 'Action', 'Comedy',
    'Adventure', 'Romance', 'Science fiction', 'Crime drama'
  ];

  let allTitles = [];
  let activeGenre = '';
  let searchQuery = '';

  async function init() {
    const titles = await fetchJSON('/api/titles');
    allTitles = titles;

    renderGenreChips();
    renderSupertopRails();
    bindEvents();
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
  }

  // ── Supertop genre chips ──

  function renderGenreChips() {
    const container = document.getElementById('supertopGenres');
    const label = '<span class="supertop-genre-label">Genres:</span>';
    const chips = GENRES.map(g =>
      `<button class="supertop-genre-chip${g === activeGenre ? ' active' : ''}" data-genre="${g}">${g}</button>`
    ).join('');
    const expandBtn = `<button class="supertop-genre-expand" aria-label="Show more genres">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>
    </button>`;
    container.innerHTML = label + chips + expandBtn;
  }

  // ── Supertop poster rails ──

  function getFilteredTitles() {
    let filtered = [...allTitles];
    if (activeGenre) {
      filtered = filtered.filter(t => t.genre === activeGenre);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      );
    }
    return filtered;
  }

  function renderSupertopRails() {
    const filtered = getFilteredTitles();
    const movies = filtered.filter(t => t.type === 'movie');
    const shows = filtered.filter(t => t.type === 'series');

    renderRailPosters('moviesRail', movies);
    renderRailPosters('showsRail', shows);
    initRailButtons();
  }

  function renderRailPosters(railId, titles) {
    const track = document.getElementById(railId);
    if (!track) return;

    if (!titles.length) {
      track.innerHTML = '<p style="color:var(--uds-foreground-tertiary);font-size:14px;padding:32px 0;">No titles found</p>';
      return;
    }

    track.innerHTML = titles.map(t => `
      <div class="supertop-poster" data-id="${t.id}">
        <img src="${t.image}" alt="${t.title}" loading="lazy">
      </div>
    `).join('');
  }

  function initRailButtons() {
    document.querySelectorAll('.supertop-rail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const railId = btn.dataset.rail;
        const track = document.getElementById(railId);
        if (!track) return;

        const scrollAmount = track.clientWidth * 0.7;
        if (btn.classList.contains('prev')) {
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('.supertop-rail-track').forEach(track => {
      const wrapper = track.closest('.supertop-rail-track-wrapper');
      const prevBtn = wrapper.querySelector('.supertop-rail-btn.prev');
      const nextBtn = wrapper.querySelector('.supertop-rail-btn.next');

      function updateButtons() {
        const atStart = track.scrollLeft <= 10;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
        if (prevBtn) prevBtn.classList.toggle('visible', !atStart);
        if (nextBtn) nextBtn.classList.toggle('visible', !atEnd);
      }

      track.addEventListener('scroll', updateButtons);
      updateButtons();
    });
  }

  // ── Events ──

  function bindEvents() {
    // Genre chips
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.supertop-genre-chip');
      if (chip) {
        const genre = chip.dataset.genre;
        activeGenre = activeGenre === genre ? '' : genre;
        document.querySelectorAll('.supertop-genre-chip').forEach(c => c.classList.remove('active'));
        if (activeGenre) chip.classList.add('active');
        renderSupertopRails();
      }
    });

    // Tab bar
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('is-selected'));
        tab.classList.add('is-selected');
      });
    });

    // Search input + clear button
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    let debounceTimer;

    function updateClearBtn() {
      clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
    }

    searchInput.addEventListener('input', () => {
      updateClearBtn();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = searchInput.value.trim();
        renderSupertopRails();
      }, 300);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      updateClearBtn();
      searchInput.focus();
      renderSupertopRails();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      renderSupertopRails();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        renderSupertopRails();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
