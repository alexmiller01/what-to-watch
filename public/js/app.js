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

  let allTitles = [];
  let featuredTitles = [];
  let currentFeaturedIndex = 0;
  let activeGenre = 'Trending';
  let activeType = '';
  let searchQuery = '';
  let heroTimer = null;

  // ── Init ──
  async function init() {
    const [genres, titles, featured] = await Promise.all([
      fetchJSON('/api/genres'),
      fetchJSON('/api/titles'),
      fetchJSON('/api/featured')
    ]);

    allTitles = titles;
    featuredTitles = featured;

    renderGenreBar(genres);
    renderMobileGenreBar(genres);
    renderHero();
    renderSections();
    bindEvents();
    startHeroRotation();
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
  }

  // ── Genre bar ──
  function renderGenreBar(genres) {
    const bar = document.getElementById('genreBar');
    bar.innerHTML = genres.map(g =>
      `<button class="genre-chip${g === activeGenre ? ' active' : ''}" data-genre="${g}">${g}</button>`
    ).join('');
  }

  function renderMobileGenreBar(genres) {
    const bar = document.getElementById('mobileGenreBar');
    bar.innerHTML = genres.map(g =>
      `<button class="genre-chip${g === activeGenre ? ' active' : ''}" data-genre="${g}">${g}</button>`
    ).join('');
  }

  // ── Hero featured ──
  function renderHero() {
    if (!featuredTitles.length) return;
    const item = featuredTitles[currentFeaturedIndex];

    document.getElementById('heroBackdrop').src = item.backdrop;
    document.getElementById('heroBackdrop').alt = item.title;
    document.getElementById('heroTitle').textContent = item.title;
    document.getElementById('heroBadge').textContent = item.type === 'series' ? 'Featured Series' : 'Featured Film';
    document.getElementById('heroDescription').textContent = item.description;

    const metaEl = document.getElementById('heroMeta');
    const scoreClass = item.score >= 70 ? 'fresh' : 'rotten';
    metaEl.innerHTML = `
      <span class="hero-score ${scoreClass}">${item.score}%</span>
      <span>${item.year}</span>
      <span class="hero-meta-dot"></span>
      <span>${item.rating}</span>
      <span class="hero-meta-dot"></span>
      <span>${item.duration}</span>
      <span class="hero-meta-dot"></span>
      <span>${item.streaming.join(', ')}</span>
    `;

    const dotsEl = document.getElementById('heroDots');
    dotsEl.innerHTML = featuredTitles.map((_, i) =>
      `<button class="hero-dot${i === currentFeaturedIndex ? ' active' : ''}" data-index="${i}"></button>`
    ).join('');
  }

  function startHeroRotation() {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredTitles.length;
      renderHero();
    }, 6000);
  }

  // ── Content sections ──
  function getFilteredTitles() {
    let filtered = [...allTitles];
    if (activeGenre && activeGenre !== 'Trending') {
      filtered = filtered.filter(t => t.genre === activeGenre);
    }
    if (activeType) {
      filtered = filtered.filter(t => t.type === activeType);
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

    if (activeGenre === 'Trending' && !searchQuery) {
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
    // Genre chips
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.genre-chip');
      if (chip) {
        activeGenre = chip.dataset.genre;
        document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
        document.querySelectorAll(`.genre-chip[data-genre="${activeGenre}"]`).forEach(c => c.classList.add('active'));
        renderSections();
      }
    });

    // Type filter chips
    document.querySelectorAll('.nav-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        activeType = chip.dataset.type;
        document.querySelectorAll('.nav-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderSections();
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = searchInput.value.trim();
        renderSections();
      }, 300);
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      searchQuery = searchInput.value.trim();
      renderSections();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        renderSections();
      }
    });

    // Title card clicks
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.title-card');
      if (card) {
        showDetail(parseInt(card.dataset.id, 10));
      }
    });

    // Hero clicks
    document.getElementById('heroWatchBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const item = featuredTitles[currentFeaturedIndex];
      if (item) showDetail(item.id);
    });

    document.getElementById('heroInfoBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const item = featuredTitles[currentFeaturedIndex];
      if (item) showDetail(item.id);
    });

    document.getElementById('heroSection').addEventListener('click', () => {
      const item = featuredTitles[currentFeaturedIndex];
      if (item) showDetail(item.id);
    });

    // Hero dots
    document.getElementById('heroDots').addEventListener('click', (e) => {
      const dot = e.target.closest('.hero-dot');
      if (dot) {
        e.stopPropagation();
        currentFeaturedIndex = parseInt(dot.dataset.index, 10);
        renderHero();
        startHeroRotation();
      }
    });

    // Detail overlay close
    document.getElementById('detailClose').addEventListener('click', hideDetail);
    document.getElementById('detailBackdrop').addEventListener('click', hideDetail);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideDetail();
    });
  }

  // Start the app
  document.addEventListener('DOMContentLoaded', init);
})();
