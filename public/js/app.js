(function () {
  'use strict';

  const STREAMING_COLORS = {
    'Netflix': '#E50914',
    'Hulu': '#1CE783',
    'Disney+': '#113CCF',
    'Max': '#002BE7',
    'Prime Video': '#00A8E1',
    'Apple TV+': '#555555',
    'Peacock': '#0D0D0D'
  };

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
    renderSections();
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

  function renderSupertopRails() {
    const movies = getFilteredTitles().filter(t => t.type === 'movie');
    const shows = getFilteredTitles().filter(t => t.type === 'series');

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

  // ── Content sections (below supertop) ──

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

  function groupByGenre(titles) {
    const groups = {};
    titles.forEach(t => {
      if (!groups[t.genre]) groups[t.genre] = [];
      groups[t.genre].push(t);
    });
    return groups;
  }

  function renderSections() {
    const container = document.getElementById('contentSections');
    const filtered = getFilteredTitles();

    if (!filtered.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎬</div>
          <h3 class="empty-state-title">No titles found</h3>
          <p class="empty-state-text">Try a different search or genre filter.</p>
        </div>
      `;
      return;
    }

    if (!activeGenre && !searchQuery) {
      const groups = groupByGenre(filtered);
      const topPicks = filtered.filter(t => t.score >= 90);
      let html = '';

      if (topPicks.length) {
        html += renderSection('Top Rated', topPicks);
      }

      for (const [genre, titles] of Object.entries(groups)) {
        html += renderSection(genre, titles);
      }

      container.innerHTML = html;
    } else {
      const label = searchQuery
        ? `Results for "${searchQuery}"`
        : activeGenre;
      container.innerHTML = renderSection(label, filtered);
    }

    initCarousels();
  }

  function renderSection(title, titles) {
    const carouselId = 'carousel-' + title.replace(/\W+/g, '-').toLowerCase();
    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">${title}</h2>
          <button class="section-see-all">See all</button>
        </div>
        <div class="carousel-wrapper">
          <button class="carousel-btn prev" data-carousel="${carouselId}" aria-label="Previous">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </button>
          <div class="carousel-track" id="${carouselId}">
            ${titles.map(t => renderTitleCard(t)).join('')}
          </div>
          <button class="carousel-btn next visible" data-carousel="${carouselId}" aria-label="Next">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function renderTitleCard(t) {
    const scoreClass = t.score >= 70 ? 'fresh' : 'rotten';
    const services = t.streaming.map(s =>
      `<span class="title-card-service">${s}</span>`
    ).join('');

    return `
      <div class="title-card" data-id="${t.id}">
        <div class="title-card-poster">
          <img src="${t.image}" alt="${t.title}" loading="lazy">
          <span class="title-card-score ${scoreClass}">${t.score}%</span>
          <div class="title-card-streaming">${services}</div>
        </div>
        <div class="title-card-info">
          <h3 class="title-card-name">${t.title}</h3>
          <div class="title-card-meta">
            <span>${t.year}</span>
            <span class="title-card-meta-dot"></span>
            <span>${t.rating}</span>
            <span class="title-card-meta-dot"></span>
            <span>${t.genre}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Carousels ──

  function initCarousels() {
    document.querySelectorAll('.carousel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.carousel;
        const track = document.getElementById(trackId);
        if (!track) return;

        const scrollAmount = track.clientWidth * 0.7;
        if (btn.classList.contains('prev')) {
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('.carousel-track').forEach(track => {
      const wrapper = track.closest('.carousel-wrapper');
      const prevBtn = wrapper.querySelector('.carousel-btn.prev');
      const nextBtn = wrapper.querySelector('.carousel-btn.next');

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

  // ── Detail overlay ──

  function showDetail(titleId) {
    const item = allTitles.find(t => t.id === titleId);
    if (!item) return;

    document.getElementById('detailImage').src = item.backdrop;
    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailDescription').textContent = item.description;

    const scoreClass = item.score >= 70 ? 'fresh' : 'rotten';
    document.getElementById('detailMeta').innerHTML = `
      <span class="detail-score ${scoreClass}">${item.score}%</span>
      <span class="detail-meta-item">${item.year}</span>
      <span class="detail-rating-badge">${item.rating}</span>
      <span class="detail-meta-item">${item.duration}</span>
      <span class="detail-meta-item">${item.genre}</span>
    `;

    const streamingEl = document.getElementById('detailStreaming');
    streamingEl.innerHTML = `
      <span class="detail-streaming-label">Available on</span>
      <div class="detail-streaming-chips">
        ${item.streaming.map(s => `
          <button class="detail-service-chip">
            <span class="detail-service-dot" style="background: ${STREAMING_COLORS[s] || '#666'}"></span>
            ${s}
          </button>
        `).join('')}
      </div>
    `;

    document.getElementById('detailOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideDetail() {
    document.getElementById('detailOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── Events ──

  function bindEvents() {
    // Genre chips in supertop
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.supertop-genre-chip');
      if (chip) {
        const genre = chip.dataset.genre;
        activeGenre = activeGenre === genre ? '' : genre;
        document.querySelectorAll('.supertop-genre-chip').forEach(c => c.classList.remove('active'));
        if (activeGenre) chip.classList.add('active');
        renderSupertopRails();
        renderSections();
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
        renderSections();
      }, 300);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      updateClearBtn();
      searchInput.focus();
      renderSupertopRails();
      renderSections();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      renderSupertopRails();
      renderSections();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        renderSupertopRails();
        renderSections();
      }
    });

    // Poster clicks (supertop rails)
    document.addEventListener('click', (e) => {
      const poster = e.target.closest('.supertop-poster');
      if (poster) {
        showDetail(parseInt(poster.dataset.id, 10));
        return;
      }

      const card = e.target.closest('.title-card');
      if (card) {
        showDetail(parseInt(card.dataset.id, 10));
      }
    });

    // Detail overlay close
    document.getElementById('detailClose').addEventListener('click', hideDetail);
    document.getElementById('detailBackdrop').addEventListener('click', hideDetail);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideDetail();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
