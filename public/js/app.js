(function () {
  'use strict';

  const GENRES = [
    'Thriller', 'Drama', 'Action', 'Comedy',
    'Adventure', 'Romance', 'Science fiction', 'Crime drama'
  ];

  let allTitles = [];
  let activeGenre = '';
  let searchQuery = '';
  let activeHoverId = null;
  let hoverTimeout = null;

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

  // ── Genre chips ──

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

  // ── Poster rails ──

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

    const posters = titles.map(t => `
      <div class="supertop-poster" data-id="${t.id}">
        <img src="${t.image}" alt="${t.title}" loading="lazy">
      </div>
    `).join('');
    track.innerHTML = posters + posters + posters;
  }

  // ── Hover card ──

  function buildHoverCard(t) {
    return `
      <div class="supertop-hover-card" data-hover-id="${t.id}">
        <div class="hover-card-video">
          <img src="${t.backdrop || t.image}" alt="${t.title}">
          <button class="hover-card-play" aria-label="Play trailer">
            <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="5,2 14,8 5,14"/></svg>
          </button>
          <span class="hover-card-duration">${t.duration}</span>
        </div>
        <div class="hover-card-info">
          <div class="hover-card-header">
            <h3 class="hover-card-title">${t.title}</h3>
            <div class="hover-card-subtitle">
              <span class="hover-card-rating-badge">${t.rating}</span>
              <span class="hover-card-meta">${t.year} · ${t.genre} · ${t.duration}</span>
            </div>
          </div>
          <div class="hover-card-ratings">
            <div class="hover-card-rating-item">
              <img class="hover-card-rating-icon" src="/assets/rotten-tomatoes.png" alt="Rotten Tomatoes">
              <span class="hover-card-rating-value">${t.rt}%</span>
            </div>
            <div class="hover-card-rating-item">
              <img class="hover-card-rating-icon" src="/assets/imdb.svg" alt="IMDb">
              <span class="hover-card-rating-value">${t.imdb}/10</span>
            </div>
            <div class="hover-card-rating-item">
              <svg class="hover-card-rating-icon" viewBox="0 0 16 16" fill="#6001d2"><circle cx="8" cy="8" r="7"/><text x="8" y="11" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Y!</text></svg>
              <span class="hover-card-rating-value">${t.yahoo.toFixed(1)}</span>
            </div>
          </div>
          <p class="hover-card-desc">${t.description}</p>
          <button class="hover-card-details-btn">
            See full details
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function showHoverCard(posterEl) {
    const id = parseInt(posterEl.dataset.id, 10);
    if (activeHoverId === id) return;

    removeHoverCard(true);
    activeHoverId = id;

    const item = allTitles.find(t => t.id === id);
    if (!item) return;

    const cardHTML = buildHoverCard(item);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML;
    const cardEl = tempDiv.firstElementChild;

    posterEl.classList.add('is-fading');
    posterEl.insertAdjacentElement('afterend', cardEl);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cardEl.classList.add('is-visible');
      });
    });

    cardEl.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });

    cardEl.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => removeHoverCard(), 200);
    });
  }

  function removeHoverCard(instant) {
    if (activeHoverId === null) return;

    const existing = document.querySelector('.supertop-hover-card');
    const fadedPoster = document.querySelector(`.supertop-poster.is-fading[data-id="${activeHoverId}"]`);

    if (existing) {
      if (instant) {
        if (fadedPoster) fadedPoster.classList.remove('is-fading');
        existing.remove();
      } else {
        existing.classList.add('is-collapsing');
        existing.classList.remove('is-visible');
        if (fadedPoster) fadedPoster.classList.remove('is-fading');

        existing.addEventListener('transitionend', function handler(e) {
          if (e.propertyName === 'max-width') {
            existing.removeEventListener('transitionend', handler);
            existing.remove();
          }
        });

        setTimeout(() => { if (existing.parentNode) existing.remove(); }, 500);
      }
    } else {
      if (fadedPoster) fadedPoster.classList.remove('is-fading');
    }

    activeHoverId = null;
  }

  // ── Rail scroll buttons ──

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
        removeHoverCard();
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

    // Search
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
        removeHoverCard();
        renderSupertopRails();
      }, 300);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      updateClearBtn();
      searchInput.focus();
      removeHoverCard();
      renderSupertopRails();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      removeHoverCard();
      renderSupertopRails();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        removeHoverCard();
        renderSupertopRails();
      }
    });

    // Poster hover → expand card
    document.addEventListener('mouseenter', (e) => {
      const poster = e.target.closest('.supertop-poster');
      if (poster) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => showHoverCard(poster), 300);
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      const poster = e.target.closest('.supertop-poster');
      if (poster) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => removeHoverCard(), 200);
      }
    }, true);

    // Close hover card when scrolling rail
    document.querySelectorAll('.supertop-rail-track').forEach(track => {
      track.addEventListener('scroll', () => {
        removeHoverCard();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
