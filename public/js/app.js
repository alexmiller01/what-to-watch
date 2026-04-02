(function () {
  'use strict';

  const GENRES_ROW1 = [
    'Thriller', 'Drama', 'Action', 'Comedy',
    'Horror', 'Animation', 'Sci-Fi'
  ];

  const GENRES_ROW2 = [];

  let genresExpanded = false;
  let allTitles = [];
  let activeGenres = [];
  let searchQuery = '';
  let showMovies = true;
  let showTV = true;
  let activeHoverId = null;
  let hoverTimeout = null;
  let railCounter = 0;

  async function init() {
    const titles = await fetchJSON('/api/titles');
    allTitles = titles;

    renderGenreChips();
    renderAllRails();
    renderCenterRail();
    renderRightRail();
    bindEvents();
  }

  function renderCenterRail() {
    const results = [
      {
        source: 'Rotten Tomatoes',
        favicon: 'https://www.google.com/s2/favicons?domain=rottentomatoes.com&sz=32',
        url: 'editorial.rottentomatoes.com \u203a guide \u203a popular-tv-shows',
        title: '25 Most Popular TV Shows Right Now: What to Watch on Streaming',
        snippet: 'Here are the current top 25 series! Click on each show for reviews and trailers, where to watch, and how to cast your own ratings vote. Check back weekly for latest updates.',
        link: 'https://editorial.rottentomatoes.com/guide/popular-tv-shows/'
      },
      {
        source: 'Decider',
        favicon: 'https://www.google.com/s2/favicons?domain=decider.com&sz=32',
        url: 'decider.com \u203a what-to-watch',
        title: 'What to Watch Right Now | Where To Stream the Best Movies & Shows',
        snippet: 'Decider\u2019s list of the best movies and shows to watch online with Netflix, Hulu, Amazon Prime, HBO, and other streaming services. Updated daily with new recommendations.',
        link: 'https://decider.com/what-to-watch/'
      },
      {
        source: 'PureWow',
        favicon: 'https://www.google.com/s2/favicons?domain=purewow.com&sz=32',
        url: 'purewow.com \u203a entertainment \u203a what-to-watch-this',
        title: '15 Shows and Movies to Watch This Weekend',
        snippet: 'Here\u2019s what to watch this weekend! From star-studded movies to buzzy new streaming shows, handpicked must-watch shows and movies. Streaming recommendations.',
        link: 'https://www.purewow.com/entertainment/what-to-watch-this-weekend'
      },
      {
        source: 'What To Watch',
        favicon: 'https://www.google.com/s2/favicons?domain=whattowatch.com&sz=32',
        url: 'whattowatch.com',
        title: 'What To Watch - Best Streaming Recommendations',
        snippet: 'Find the best movies and TV shows to stream right now. Expert reviews, ratings, and where to watch guides for Netflix, Hulu, HBO Max, and more.',
        link: 'https://www.whattowatch.com/'
      },
      {
        source: 'Digital Trends',
        favicon: 'https://www.google.com/s2/favicons?domain=digitaltrends.com&sz=32',
        url: 'digitaltrends.com \u203a movies \u203a best-new-shows-to',
        title: 'The best new shows to stream on Netflix, Hulu, HBO Max, and more',
        snippet: 'Read the entire guide for the full list of recommendations. We also have guides to the best new movies to stream, the best shows on Netflix, and best shows on Hulu.',
        link: 'https://www.digitaltrends.com/movies/best-new-shows-to-stream-this-week/'
      },
      {
        source: 'Shortlist',
        favicon: 'https://www.google.com/s2/favicons?domain=shortlist.com&sz=32',
        url: 'shortlist.com \u203a news \u203a new-on-streaming-tv-show',
        title: 'What to watch: new movies and TV shows to stream this week',
        snippet: 'Welcome to the WatchList, the ultimate what to watch guide. Each week, our TV and movie experts curate a list of the best things to watch on streaming.',
        link: 'https://www.shortlist.com/news/new-on-streaming-tv-show-movies-402461'
      },
      {
        source: 'The Wrap',
        favicon: 'https://www.google.com/s2/favicons?domain=thewrap.com&sz=32',
        url: 'thewrap.com \u203a what-to-watch',
        title: 'What to Watch - TheWrap',
        snippet: 'Discover the latest new releases on Netflix, Hulu, Amazon Prime, and more. Stay up-to-date with top streaming picks and never miss the best shows and movies!',
        link: 'https://www.thewrap.com/what-to-watch/'
      },
      {
        source: 'Yahoo Entertainment',
        favicon: 'https://www.google.com/s2/favicons?domain=yahoo.com&sz=32',
        url: 'yahoo.com \u203a entertainment \u203a movies',
        title: 'Best Movies and TV Shows to Watch in 2026',
        snippet: 'Yahoo Entertainment\u2019s guide to the best movies and TV shows streaming now. Reviews, trailers, and recommendations from our entertainment editors.',
        link: 'https://www.yahoo.com/entertainment/'
      }
    ];

    const container = document.getElementById('centerRail');
    container.innerHTML = results.map(r => `
      <div class="algo">
        <div class="algo-source">
          <div class="algo-favicon"><img src="${r.favicon}" alt=""></div>
          <div>
            <span class="algo-source-name">${r.source}</span>
            <span class="algo-source-url">${r.url}</span>
          </div>
        </div>
        <h3 class="algo-title"><a href="${r.link}" target="_blank" rel="noopener">${r.title}</a></h3>
        <p class="algo-snippet">${r.snippet}</p>
      </div>
    `).join('');
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
  }

  // ── Right rail: Yahoo Top 100 ──

  function renderRightRail() {
    const y100 = [
      { rank: 1, title: 'Project Hail Mary', rt: 96, imdb: 8.1, rating: 'PG-13', year: 2026, genre: 'Science fiction', duration: '2h 36m', score: 93.5, image: 'https://media.themoviedb.org/t/p/w342/kjMbDciooTbJPofVXgAoFjfX8Of.jpg' },
      { rank: 2, title: 'Sinners', rt: 97, imdb: 7.5, rating: 'R', year: 2025, genre: 'Horror', duration: '2h 17m', score: 90.2, image: 'https://media.themoviedb.org/t/p/w342/705nQHqe4JGdEisrQmVYmXyjs1U.jpg' },
      { rank: 3, title: 'The Wild Robot', rt: 98, imdb: 8.2, rating: 'PG', year: 2024, genre: 'Animation', duration: '1h 42m', score: 88.7, image: 'https://media.themoviedb.org/t/p/w342/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg' },
      { rank: 4, title: 'Conclave', rt: 93, imdb: 7.6, rating: 'PG', year: 2024, genre: 'Thriller', duration: '2h 0m', score: 86.4, image: 'https://media.themoviedb.org/t/p/w342/jf3YO8hOqGHCupsREf5qymYq1n.jpg' },
      { rank: 5, title: 'Flow', rt: 95, imdb: 8.3, rating: 'PG', year: 2024, genre: 'Animation', duration: '1h 25m', score: 85.1, image: 'https://media.themoviedb.org/t/p/w342/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg' },
    ];

    const container = document.getElementById('rightRail');
    const rows = y100.map((t, i) => `
      <div class="y100-item">
        <div class="y100-poster">
          <img src="${t.image}" alt="${t.title}" loading="lazy">
        </div>
        <div class="y100-info">
          <p class="y100-name">${t.rank}. ${t.title}</p>
          <div class="y100-ratings">
            <div class="y100-rating-item">
              <img class="y100-rating-icon" src="/assets/rotten-tomatoes.png" alt="RT">
              <span class="y100-rating-value">${t.rt}%</span>
            </div>
            <div class="y100-rating-item">
              <img class="y100-rating-icon" src="/assets/imdb.svg" alt="IMDb">
              <span class="y100-rating-value">${t.imdb}/10</span>
            </div>
          </div>
          <div class="y100-meta">
            <span class="y100-rating-badge">${t.rating}</span>
            <span class="y100-meta-text">${t.year} · ${t.genre} · ${t.duration}</span>
          </div>
        </div>
        <span class="y100-score">${t.score.toFixed(1)}</span>
      </div>
      ${i < y100.length - 1 ? '<hr class="y100-divider">' : ''}
    `).join('');

    container.innerHTML = `
      <div class="y100">
        <h2 class="y100-title">Yahoo top 100</h2>
        <div class="y100-list">${rows}</div>
        <a class="y100-more-btn" href="https://www.yahoo.com/films/best-movies/" target="_blank" rel="noopener">
          More on Yahoo Entertainment
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
        </a>
      </div>
    `;
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
      let html = '';
      if (showMovies) html += buildRailHTML('Movies', pool.filter(t => t.type === 'movie'));
      if (showTV) html += buildRailHTML('Shows', pool.filter(t => t.type === 'series'));
      container.innerHTML = html;
    } else {
      let html = '';

      for (const genre of activeGenres) {
        if (showMovies) {
          html += buildRailHTML(`${genre} movies`, pool.filter(t => t.type === 'movie' && t.genre === genre));
        }
        if (showTV) {
          html += buildRailHTML(`${genre} shows`, pool.filter(t => t.type === 'series' && t.genre === genre));
        }
      }

      if (activeGenres.length > 1) {
        const comboLabel = activeGenres.join(' + ');
        const comboTitles = pool.filter(t => activeGenres.includes(t.genre) && ((showMovies && t.type === 'movie') || (showTV && t.type === 'series')));
        html += buildRailHTML(`All ${comboLabel}`, comboTitles);
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
    const posters = posterHTML;

    return `
      <div class="supertop-rail">
        <div class="supertop-rail-header">
          <h2 class="supertop-rail-title">${title}</h2>
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

  function buildMobileHoverCard(t) {
    return `
      <div class="supertop-hover-card" data-hover-id="${t.id}">
        <div class="mobile-hover-header">
          <div>
            <h3 class="mobile-hover-title">${t.title}</h3>
            <div class="mobile-hover-meta">
              <span class="hover-card-rating-badge">${t.rating}</span>
              <span class="hover-card-meta">${t.year} · ${t.genre} · ${t.duration}</span>
            </div>
          </div>
          <button class="mobile-hover-close" aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
          </button>
        </div>
        <div class="mobile-hover-backdrop">
          <img src="${t.backdrop || t.image}" alt="${t.title}">
          <button class="supertop-trailer-play" aria-label="Play trailer" data-trailer="${t.trailer || ''}">
            <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="5,2 14,8 5,14"/></svg>
          </button>
          <span class="supertop-trailer-duration">${t.duration}</span>
        </div>
        <div class="mobile-hover-ratings">
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
        <a class="hover-card-details-btn mobile-hover-details" href="https://search.yahoo.com/search?p=${encodeURIComponent(t.title + ' ' + t.year)}" target="_blank" rel="noopener">
          See full details
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>
        </a>
      </div>
    `;
  }

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

    const mobile = window.matchMedia('(max-width: 767px)').matches;

    if (mobile) {
      const mobileCardHTML = buildMobileHoverCard(item);
      const mobileTempDiv = document.createElement('div');
      mobileTempDiv.innerHTML = mobileCardHTML;
      const mobileCardEl = mobileTempDiv.firstElementChild;
      mobileCardEl.classList.add('is-mobile');

      const closeBtn = mobileCardEl.querySelector('.mobile-hover-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeHoverCard();
        });
      }

      const playBtn = mobileCardEl.querySelector('.supertop-trailer-play');
      if (playBtn && playBtn.dataset.trailer) {
        const tid = playBtn.dataset.trailer;
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const bd = mobileCardEl.querySelector('.mobile-hover-backdrop');
          if (bd) {
            bd.innerHTML = `<iframe src="https://www.youtube.com/embed/${tid}?autoplay=1&modestbranding=1&rel=0&showinfo=0" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;aspect-ratio:16/9;border:none;border-radius:var(--uds-radius-xl);"></iframe>`;
          }
        });
      }

      const rail = posterEl.closest('.supertop-rail');
      if (rail) {
        rail.insertAdjacentElement('afterend', mobileCardEl);
      } else {
        posterEl.insertAdjacentElement('afterend', mobileCardEl);
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mobileCardEl.classList.add('is-visible');
          mobileCardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });
    } else {
      const track = posterEl.closest('.supertop-rail-track');
      const expandedPosterWidth = 369;
      const cardInfoWidth = 340;

      if (track) {
        const trackRect = track.getBoundingClientRect();
        const posterRect = posterEl.getBoundingClientRect();
        const spaceRight = trackRect.right - posterRect.left - expandedPosterWidth;

        posterEl.insertAdjacentElement('afterend', cardEl);

        if (spaceRight < cardInfoWidth) {
          const scrollAmount = cardInfoWidth - spaceRight + 40;
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cardEl.classList.add('is-visible');
          });
        });

        setTimeout(() => {
          if (!cardEl.parentNode) return;
          const posterR = posterEl.getBoundingClientRect();
          const cardR = cardEl.getBoundingClientRect();
          const trackR = track.getBoundingClientRect();

          const leftEdge = Math.min(posterR.left, cardR.left);
          const rightEdge = Math.max(posterR.right, cardR.right);

          if (rightEdge > trackR.right) {
            track.scrollBy({ left: rightEdge - trackR.right + 20, behavior: 'smooth' });
          } else if (leftEdge < trackR.left) {
            track.scrollBy({ left: leftEdge - trackR.left - 20, behavior: 'smooth' });
          }
        }, 450);
      } else {
        posterEl.insertAdjacentElement('afterend', cardEl);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cardEl.classList.add('is-visible');
          });
        });
      }
    }
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
    const servicesDropdownBtn = document.getElementById('servicesDropdownBtn');
    const servicesDropdown = document.getElementById('servicesDropdown');
    if (servicesDropdownBtn && servicesDropdown) {
      servicesDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        servicesDropdown.classList.toggle('is-open');
      });
    }

    // Genre expand toggle
    document.addEventListener('click', (e) => {
      const dropdownItem = e.target.closest('.dropdown-item');
      if (dropdownItem) {
        e.stopPropagation();
        const checkbox = dropdownItem.querySelector('.dropdown-checkbox');
        if (checkbox) checkbox.classList.toggle('is-checked');

        const filter = dropdownItem.dataset.filter;
        if (filter === 'movies') {
          showMovies = checkbox.classList.contains('is-checked');
          renderAllRails();
        } else if (filter === 'tv') {
          showTV = checkbox.classList.contains('is-checked');
          renderAllRails();
        }
        return;
      }

      const servicesDropdownEl = document.getElementById('servicesDropdown');
      if (servicesDropdownEl && servicesDropdownEl.classList.contains('is-open')) {
        if (!e.target.closest('.dropdown-wrap')) {
          servicesDropdownEl.classList.remove('is-open');
        }
      }

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

    // Detect touch device
    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

    // Mobile: tap poster to expand/collapse
    document.addEventListener('click', (e) => {
      const poster = e.target.closest('.supertop-poster');
      if (!poster) return;
      if (!isMobile()) return;

      const playing = document.querySelector('.supertop-poster-trailer.is-playing');
      if (playing) return;

      const id = parseInt(poster.dataset.id, 10);
      if (activeHoverId === id) {
        removeHoverCard();
      } else {
        showHoverCard(poster);
      }
    });

    // Desktop: hover to expand
    document.addEventListener('mouseover', (e) => {
      if (isMobile()) return;

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
      if (isMobile()) return;

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

  // ── Movie picker overlay ──

  function initPicker() {
    const overlay = document.getElementById('pickerOverlay');
    const closeBtn = document.getElementById('pickerClose');
    const submitBtn = document.getElementById('pickerSubmit');
    const chipsContainer = document.getElementById('pickerChips');
    const triggerIcon = document.querySelector('.supertop-title-icon');

    if (triggerIcon) {
      triggerIcon.style.cursor = 'pointer';
      triggerIcon.addEventListener('click', () => {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    closeBtn.addEventListener('click', closePicker);

    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.picker-chip');
      if (!chip) return;

      if (chip.classList.contains('is-selected')) {
        chip.classList.remove('is-selected');
      } else {
        const selected = chipsContainer.querySelectorAll('.picker-chip.is-selected');
        if (selected.length >= 3) return;
        chip.classList.add('is-selected');
      }
    });

    const tagToGenre = {
      'Action & adventure': 'Action', 'Comedy': 'Comedy', 'Drama': 'Drama',
      'Horror': 'Horror', 'Sci-fi': 'Sci-Fi', 'Aliens': 'Sci-Fi',
      'Animated': 'Animation', 'Romance': 'Drama', 'Robots': 'Sci-Fi',
      'Magic': 'Animation', 'Thriller': 'Thriller',
    };

    submitBtn.addEventListener('click', () => {
      const selected = [...chipsContainer.querySelectorAll('.picker-chip.is-selected')]
        .map(c => c.dataset.tag);

      if (selected.length === 0) return;

      const matchGenres = selected.map(s => tagToGenre[s]).filter(Boolean);
      let candidates = allTitles.filter(t => t.type === 'movie' && t.trailer);

      if (matchGenres.length > 0) {
        const genreMatches = candidates.filter(t => matchGenres.includes(t.genre));
        if (genreMatches.length > 0) candidates = genreMatches;
      }

      if (selected.includes('New releases')) {
        const recent = candidates.filter(t => t.year >= 2024);
        if (recent.length > 0) candidates = recent;
      }
      if (selected.includes('Timeless classics')) {
        const classics = candidates.filter(t => t.year <= 2015);
        if (classics.length > 0) candidates = classics;
      }
      if (selected.includes("80's")) {
        const era = candidates.filter(t => t.year >= 1980 && t.year < 1990);
        if (era.length > 0) candidates = era;
      }
      if (selected.includes("90's or 00's")) {
        const era = candidates.filter(t => t.year >= 1990 && t.year < 2010);
        if (era.length > 0) candidates = era;
      }
      if (selected.includes('Family friendly')) {
        const fam = candidates.filter(t => t.rating === 'PG' || t.rating === 'PG-13');
        if (fam.length > 0) candidates = fam;
      }
      if (selected.includes('90 min')) {
        const short = candidates.filter(t => {
          const m = t.duration.match(/(\d+)h\s*(\d+)/);
          return m && (parseInt(m[1]) * 60 + parseInt(m[2])) <= 100;
        });
        if (short.length > 0) candidates = short;
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (!pick) return;

      const card = document.querySelector('.picker-card');
      card.classList.add('is-result');
      card.innerHTML = `
        <button class="picker-close" id="pickerCloseResult" aria-label="Close">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
        </button>
        <div class="picker-result">
          <div class="picker-result-video">
            <iframe src="https://www.youtube.com/embed/${pick.trailer}?modestbranding=1&rel=0" allow="encrypted-media" allowfullscreen></iframe>
          </div>
        </div>
      `;

      const wtw = document.createElement('div');
      wtw.className = 'picker-wtw';
      wtw.innerHTML = `
        <h3 class="picker-wtw-title">Where to watch ${pick.title}</h3>
        <div class="picker-wtw-services">
          <div class="picker-wtw-row">
            <div class="picker-wtw-service">
              <svg class="picker-wtw-icon" viewBox="0 0 24 24" fill="var(--uds-foreground-primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <div class="picker-wtw-info">
                <span class="picker-wtw-name">Pick theater</span>
                <span class="picker-wtw-price">Select showtimes</span>
              </div>
            </div>
            <a class="picker-wtw-btn" href="https://search.yahoo.com/search?p=${encodeURIComponent(pick.title + ' showtimes')}" target="_blank" rel="noopener">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><polygon points="7,6 7,10 10,8" fill="currentColor"/></svg>
              Get tickets
            </a>
          </div>
          <div class="picker-wtw-row">
            <div class="picker-wtw-service">
              <img class="picker-wtw-icon" src="https://www.google.com/s2/favicons?domain=paramountplus.com&sz=64" alt="">
              <div class="picker-wtw-info">
                <span class="picker-wtw-name">Paramount+</span>
                <span class="picker-wtw-price">Rental starting at $3.99</span>
              </div>
            </div>
            <a class="picker-wtw-btn" href="https://www.paramountplus.com/" target="_blank" rel="noopener">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5,3 13,8 5,13" fill="currentColor"/></svg>
              Watch
            </a>
          </div>
          <div class="picker-wtw-row">
            <div class="picker-wtw-service">
              <img class="picker-wtw-icon" src="https://www.google.com/s2/favicons?domain=max.com&sz=64" alt="">
              <div class="picker-wtw-info">
                <span class="picker-wtw-name">HBO Max</span>
                <span class="picker-wtw-price">Rental starting at $3.99</span>
              </div>
            </div>
            <a class="picker-wtw-btn" href="https://www.max.com/" target="_blank" rel="noopener">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5,3 13,8 5,13" fill="currentColor"/></svg>
              Watch
            </a>
          </div>
        </div>
        <button class="picker-wtw-more">Show more <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg></button>
      `;
      overlay.appendChild(wtw);

      const detail = document.createElement('div');
      detail.className = 'picker-detail';
      detail.innerHTML = `
        <h3 class="picker-detail-title">${pick.title}</h3>
        <div class="picker-detail-meta">
          <span class="hover-card-rating-badge">${pick.rating}</span>
          <span>${pick.year} · ${pick.genre} · ${pick.duration}</span>
        </div>
        <div class="picker-detail-poster">
          <img src="${pick.backdrop}" alt="${pick.title}">
          <span class="supertop-trailer-duration">${pick.duration}</span>
        </div>
        <div class="picker-detail-scores">
          <div class="picker-detail-score-box">
            <span class="picker-detail-score-label">IMDb</span>
            <span class="picker-detail-score-value">${pick.imdb}/10</span>
          </div>
          <div class="picker-detail-score-box">
            <span class="picker-detail-score-label">Rotten Tomatoes</span>
            <span class="picker-detail-score-value">${pick.rt}%</span>
          </div>
        </div>
        <div class="picker-detail-overview">
          <h4>Overview</h4>
          <p>${pick.description || 'No description available.'}</p>
        </div>
        <button class="picker-submit" id="pickerTryAgain">Pick again</button>
      `;
      overlay.appendChild(detail);

      document.getElementById('pickerCloseResult').addEventListener('click', closePicker);
      document.getElementById('pickerTryAgain').addEventListener('click', () => {
        const extra = overlay.querySelectorAll('.picker-wtw, .picker-detail');
        extra.forEach(el => el.remove());
        card.classList.remove('is-result');
        resetPickerCard();
      });
    });

    function resetPickerCard() {
      const card = document.querySelector('.picker-card');
      card.innerHTML = `
        <button class="picker-close" id="pickerClose" aria-label="Close">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
        </button>
        <h2 class="picker-title">Pick up to 3 to narrow down:</h2>
        <div class="picker-chips" id="pickerChips">
          ${['Timeless classics',"80\\'s","90\\'s or 00\\'s",'New releases','Action & adventure','Romance','Light-hearted','Family friendly','Animated','Live action','Oscar movie','Dad movie','Historical','B movie','Bee movie','High school drama','Foreign film','Magic','Robots','90 min','Comedy','Drama','Sci-fi','Aliens','Horror','Trilogy'].map(t =>
            `<button class="picker-chip" data-tag="${t}">${t}</button>`
          ).join('')}
        </div>
        <button class="picker-submit" id="pickerSubmit">Pick a movie</button>
      `;
      document.getElementById('pickerClose').addEventListener('click', closePicker);
      initPicker();
    }

    function closePicker() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        const extra = overlay.querySelectorAll('.picker-wtw, .picker-detail');
        extra.forEach(el => el.remove());
        const card = document.querySelector('.picker-card');
        if (card) card.classList.remove('is-result');
        resetPickerCard();
      }, 300);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePicker();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    initPicker();
  });
})();
