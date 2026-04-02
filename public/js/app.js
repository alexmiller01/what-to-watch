(function () {
  'use strict';

  const GENRES_ROW1 = [
    'Thriller', 'Drama', 'Action', 'Comedy',
    'Adventure', 'Romance', 'Science fiction', 'Crime drama'
  ];

  const GENRES_ROW2 = [
    'Horror', 'Animation', 'Documentary', 'Fantasy',
    'Mystery', 'Musical', 'Western', 'War'
  ];

  let genresExpanded = false;
  let allTitles = [];
  let activeGenres = [];
  let searchQuery = '';
  let activeHoverId = null;
  let hoverTimeout = null;
  let railCounter = 0;

  async function init() {
    const titles = await fetchJSON('/api/titles');
    allTitles = titles;

    renderGenreChips();
    renderAllRails();
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

    function chipHTML(g) {
      const isActive = activeGenres.includes(g);
      return `<button class="supertop-genre-chip${isActive ? ' active' : ''}" data-genre="${g}">${g}</button>`;
    }

    const row1 = GENRES_ROW1.map(chipHTML).join('');
    const expandBtn = `<button class="supertop-genre-expand${genresExpanded ? ' is-expanded' : ''}" id="genreExpandBtn" aria-label="Show more genres">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>
    </button>`;

    const row2 = `<div class="supertop-genre-row2${genresExpanded ? ' is-visible' : ''}" id="genreRow2">
      ${GENRES_ROW2.map(chipHTML).join('')}
    </div>`;

    container.innerHTML = label + row1 + expandBtn + row2;
  }

  // ── Dynamic rail rendering ──

  function getSearchFiltered() {
    if (!searchQuery) return allTitles;
    const q = searchQuery.toLowerCase();
    return allTitles.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q)
    );
  }

  function renderAllRails() {
    removeHoverCard(true);
    const container = document.getElementById('supertopRails');
    const pool = getSearchFiltered();

    if (activeGenres.length === 0) {
      const movies = pool.filter(t => t.type === 'movie');
      const shows = pool.filter(t => t.type === 'series');
      container.innerHTML = buildRailHTML('Movies', movies) + buildRailHTML('Shows', shows);
    } else {
      let html = '';

      for (const genre of activeGenres) {
        const genreMovies = pool.filter(t => t.type === 'movie' && t.genre === genre);
        const genreShows = pool.filter(t => t.type === 'series' && t.genre === genre);
        html += buildRailHTML(`${genre} movies`, genreMovies);
        html += buildRailHTML(`${genre} shows`, genreShows);
      }

      if (activeGenres.length > 1) {
        const comboLabel = activeGenres.map(g => g.toLowerCase()).join(' ');
        const comboTitles = pool.filter(t => activeGenres.includes(t.genre));
        html += buildRailHTML(capitalizeFirst(comboLabel), comboTitles);
      }

      container.innerHTML = html;
    }

    initRailButtons();
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function buildRailHTML(title, titles) {
    railCounter++;
    const railId = 'rail-' + railCounter;

    if (!titles.length) {
      return '';
    }

    const posterHTML = titles.map(t => `
      <div class="supertop-poster" data-id="${t.id}" data-trailer="${t.trailer || ''}" data-backdrop="${t.backdrop || t.image}" data-duration="${t.duration}">
        <img class="supertop-poster-art" src="${t.image}" alt="${t.title}" loading="lazy">
        <div class="supertop-poster-trailer"></div>
      </div>
    `).join('');
    const repeatCount = Math.max(3, Math.ceil(30 / titles.length));
    const posters = posterHTML.repeat(repeatCount);

    return `
      <div class="supertop-rail">
        <div class="supertop-rail-header">
          <h2 class="supertop-rail-title">${title}</h2>
          <button class="supertop-rail-hide" aria-label="Hide ${title}">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.5 8c1.5-3 3.5-4.5 5.5-4.5s4 1.5 5.5 4.5c-1.5 3-3.5 4.5-5.5 4.5S4 11 2.5 8z"/><circle cx="8" cy="8" r="2"/><line x1="3" y1="13" x2="13" y2="3"/></svg>
          </button>
        </div>
        <div class="supertop-rail-track-wrapper">
          <div class="supertop-rail-track" id="${railId}">${posters}</div>
          <button class="supertop-rail-btn prev" data-rail="${railId}" aria-label="Previous">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </button>
          <button class="supertop-rail-btn next visible" data-rail="${railId}" aria-label="Next">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  // ── Hover card ──

  function buildHoverCard(t) {
    return `
      <div class="supertop-hover-card" data-hover-id="${t.id}">
        <div class="hover-card-info">
          <div class="hover-card-header">
            <h3 class="hover-card-title">${t.title}</h3>
            <div class="hover-card-subtitle">
              <span class="hover-card-rating-badge">${t.rating}</span>
              <span class="hover-card-meta">${t.year} · ${t.genre} · ${t.duration}</span>
            </div>
          </div>
          <div class="hover-card-ratings">
            <a class="hover-card-rating-link" href="${t.rtUrl}" target="_blank" rel="noopener">
              <img class="hover-card-rating-icon" src="/assets/rotten-tomatoes.png" alt="Rotten Tomatoes">
              <span class="hover-card-rating-value">${t.rt}%</span>
            </a>
            <a class="hover-card-rating-link" href="${t.imdbUrl}" target="_blank" rel="noopener">
              <img class="hover-card-rating-icon" src="/assets/imdb.svg" alt="IMDb">
              <span class="hover-card-rating-value">${t.imdb}/10</span>
            </a>
            <a class="hover-card-rating-link" href="https://www.yahoo.com/films/best-movies/" target="_blank" rel="noopener">
              <img class="hover-card-rating-icon" src="/assets/YEP.svg" alt="Yahoo">
              <span class="hover-card-rating-value">${t.yahoo.toFixed(1)}</span>
            </a>
          </div>
          <p class="hover-card-desc">${t.description}</p>
          <a class="hover-card-details-btn" href="https://search.yahoo.com/search?p=${encodeURIComponent(t.title + ' ' + t.year)}" target="_blank" rel="noopener">
            See full details
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </a>
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

    const trailerLayer = posterEl.querySelector('.supertop-poster-trailer');
    const backdrop = posterEl.dataset.backdrop;
    const duration = posterEl.dataset.duration;
    const trailerId = posterEl.dataset.trailer;

    if (trailerLayer && !trailerLayer.classList.contains('is-playing')) {
      trailerLayer.innerHTML = `
        <img src="${backdrop}" alt="">
        <button class="supertop-trailer-play" aria-label="Play trailer">
          <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="5,2 14,8 5,14"/></svg>
        </button>
        <span class="supertop-trailer-duration">${duration}</span>
      `;

      const playBtn = trailerLayer.querySelector('.supertop-trailer-play');
      if (playBtn && trailerId) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          trailerLayer.classList.add('is-playing');
          trailerLayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailerId}?autoplay=1&modestbranding=1&rel=0&showinfo=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        });
      }
    }

    posterEl.classList.add('is-active');
    posterEl.insertAdjacentElement('afterend', cardEl);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cardEl.classList.add('is-visible');
      });
    });
  }

  function removeHoverCard(instant) {
    if (activeHoverId === null) return;

    const existing = document.querySelector('.supertop-hover-card');
    const activePoster = document.querySelector('.supertop-poster.is-active');

    if (activePoster) {
      activePoster.classList.remove('is-active');
      const trailerLayer = activePoster.querySelector('.supertop-poster-trailer');
      if (trailerLayer) {
        setTimeout(() => {
          trailerLayer.innerHTML = '';
          trailerLayer.classList.remove('is-playing');
        }, 400);
      }
    }

    if (existing) {
      if (instant) {
        existing.remove();
      } else {
        existing.classList.remove('is-visible');
        existing.addEventListener('transitionend', function handler(e) {
          if (e.propertyName === 'max-width') {
            existing.removeEventListener('transitionend', handler);
            existing.remove();
          }
        });
        setTimeout(() => { if (existing.parentNode) existing.remove(); }, 500);
      }
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
    // Genre expand toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#genreExpandBtn')) {
        genresExpanded = !genresExpanded;
        renderGenreChips();
        return;
      }

      // Genre chips — multi-select toggle
      const chip = e.target.closest('.supertop-genre-chip');
      if (chip) {
        const genre = chip.dataset.genre;
        const idx = activeGenres.indexOf(genre);
        if (idx === -1) {
          activeGenres.push(genre);
        } else {
          activeGenres.splice(idx, 1);
        }
        renderGenreChips();
        renderAllRails();
        return;
      }

      // Click outside dismisses a locked (playing) card
      const playing = document.querySelector('.supertop-poster-trailer.is-playing');
      if (playing) {
        if (e.target.closest('.supertop-poster.is-active')) return;
        if (e.target.closest('.supertop-hover-card')) return;
        removeHoverCard();
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
        renderAllRails();
      }, 300);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      updateClearBtn();
      searchInput.focus();
      renderAllRails();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      renderAllRails();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        renderAllRails();
      }
    });

    // Poster hover → expand card
    document.addEventListener('mouseover', (e) => {
      const hoverCard = e.target.closest('.supertop-hover-card');
      if (hoverCard) {
        clearTimeout(hoverTimeout);
        return;
      }

      const poster = e.target.closest('.supertop-poster');
      if (poster) {
        const playing = document.querySelector('.supertop-poster-trailer.is-playing');
        if (playing) return;
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => showHoverCard(poster), 300);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const playing = document.querySelector('.supertop-poster-trailer.is-playing');
      if (playing) return;

      const poster = e.target.closest('.supertop-poster');
      const hoverCard = e.target.closest('.supertop-hover-card');

      if (poster || hoverCard) {
        const related = e.relatedTarget;
        if (related) {
          if (related.closest('.supertop-hover-card')) return;
          if (related.closest('.supertop-poster.is-active')) return;
        }

        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => removeHoverCard(), 150);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
