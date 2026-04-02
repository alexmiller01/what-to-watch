const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

const GENRES = [
  'Trending', 'Action', 'Comedy', 'Drama', 'Sci-Fi',
  'Horror', 'Documentary', 'Animation', 'Thriller', 'Romance'
];

const STREAMING_SERVICES = [
  { name: 'Netflix', color: '#E50914' },
  { name: 'Hulu', color: '#1CE783' },
  { name: 'Disney+', color: '#113CCF' },
  { name: 'Max', color: '#002BE7' },
  { name: 'Prime Video', color: '#00A8E1' },
  { name: 'Apple TV+', color: '#000000' },
  { name: 'Peacock', color: '#000000' }
];

const TITLES = [
  {
    id: 1, title: 'Dune: Part Two', year: 2024, rating: 'PG-13',
    score: 93, genre: 'Sci-Fi', type: 'movie',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=600&fit=crop',
    description: 'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family.',
    streaming: ['Max'], duration: '2h 46m'
  },
  {
    id: 2, title: 'The Bear', year: 2024, rating: 'TV-MA',
    score: 96, genre: 'Drama', type: 'series',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop',
    description: 'A chef returns to Chicago to run his family sandwich shop after a tragedy.',
    streaming: ['Hulu'], duration: '3 Seasons'
  },
  {
    id: 3, title: 'Oppenheimer', year: 2023, rating: 'R',
    score: 94, genre: 'Drama', type: 'movie',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    description: 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.',
    streaming: ['Peacock'], duration: '3h 0m'
  },
  {
    id: 4, title: 'Shogun', year: 2024, rating: 'TV-MA',
    score: 99, genre: 'Drama', type: 'series',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&h=600&fit=crop',
    description: 'An English sailor becomes embroiled in a power struggle in feudal Japan.',
    streaming: ['Hulu', 'Disney+'], duration: '1 Season'
  },
  {
    id: 5, title: 'Poor Things', year: 2024, rating: 'R',
    score: 92, genre: 'Comedy', type: 'movie',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop',
    description: 'A young woman is brought back to life by a brilliant scientist and embarks on a journey of self-discovery.',
    streaming: ['Hulu'], duration: '2h 21m'
  },
  {
    id: 6, title: 'Fallout', year: 2024, rating: 'TV-MA',
    score: 94, genre: 'Sci-Fi', type: 'series',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
    description: 'In a post-apocalyptic world, survivors navigate the wasteland of a retro-futuristic America.',
    streaming: ['Prime Video'], duration: '1 Season'
  },
  {
    id: 7, title: 'Godzilla x Kong', year: 2024, rating: 'PG-13',
    score: 55, genre: 'Action', type: 'movie',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
    description: 'Two legendary Titans team up against a colossal undiscovered threat.',
    streaming: ['Max'], duration: '1h 55m'
  },
  {
    id: 8, title: 'Baby Reindeer', year: 2024, rating: 'TV-MA',
    score: 98, genre: 'Thriller', type: 'series',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
    description: 'A comedian\'s life is turned upside down when a chance encounter triggers a stalking nightmare.',
    streaming: ['Netflix'], duration: '1 Season'
  },
  {
    id: 9, title: 'Ripley', year: 2024, rating: 'TV-MA',
    score: 95, genre: 'Thriller', type: 'series',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=600&fit=crop',
    description: 'A con artist assumes a new identity while navigating the glamorous Italian landscape.',
    streaming: ['Netflix'], duration: '1 Season'
  },
  {
    id: 10, title: 'Migration', year: 2023, rating: 'PG',
    score: 56, genre: 'Animation', type: 'movie',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=600&fit=crop',
    description: 'A family of ducks persuades their overprotective father to go on a vacation of a lifetime.',
    streaming: ['Peacock'], duration: '1h 23m'
  },
  {
    id: 11, title: 'Anatomy of a Fall', year: 2024, rating: 'R',
    score: 96, genre: 'Drama', type: 'movie',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop',
    description: 'A writer is suspected of her husband\'s murder after he falls from their chalet.',
    streaming: ['Hulu'], duration: '2h 31m'
  },
  {
    id: 12, title: 'The Gentlemen', year: 2024, rating: 'TV-MA',
    score: 83, genre: 'Action', type: 'series',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    description: 'An aristocrat inherits an estate with a cannabis empire hidden within it.',
    streaming: ['Netflix'], duration: '1 Season'
  },
  {
    id: 13, title: 'Civil War', year: 2024, rating: 'R',
    score: 82, genre: 'Action', type: 'movie',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
    description: 'A team of journalists travel through a near-future America gripped by civil conflict.',
    streaming: ['Apple TV+'], duration: '1h 49m'
  },
  {
    id: 14, title: 'Curb Your Enthusiasm', year: 2024, rating: 'TV-MA',
    score: 88, genre: 'Comedy', type: 'series',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&h=600&fit=crop',
    description: 'Larry David navigates the social minefields of modern life in the final season.',
    streaming: ['Max'], duration: '12 Seasons'
  },
  {
    id: 15, title: '3 Body Problem', year: 2024, rating: 'TV-MA',
    score: 76, genre: 'Sci-Fi', type: 'series',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=600&fit=crop',
    description: 'Five friends uncover a mystery that spans centuries and threatens Earth\'s existence.',
    streaming: ['Netflix'], duration: '1 Season'
  },
  {
    id: 16, title: 'Immaculate', year: 2024, rating: 'R',
    score: 63, genre: 'Horror', type: 'movie',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&h=600&fit=crop',
    description: 'A young nun at a remote Italian convent discovers a dark secret behind its sacred walls.',
    streaming: ['Hulu'], duration: '1h 29m'
  },
  {
    id: 17, title: 'Spaceman', year: 2024, rating: 'PG-13',
    score: 48, genre: 'Sci-Fi', type: 'movie',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=600&fit=crop',
    description: 'An astronaut on a solo mission discovers a mysterious creature that helps him mend his marriage.',
    streaming: ['Netflix'], duration: '1h 47m'
  },
  {
    id: 18, title: 'Love Lies Bleeding', year: 2024, rating: 'R',
    score: 91, genre: 'Romance', type: 'movie',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&h=900&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&h=600&fit=crop',
    description: 'A reclusive gym manager falls for an ambitious bodybuilder passing through town.',
    streaming: ['Hulu'], duration: '1h 44m'
  }
];

app.get('/api/genres', (req, res) => {
  res.json(GENRES);
});

app.get('/api/services', (req, res) => {
  res.json(STREAMING_SERVICES);
});

app.get('/api/titles', (req, res) => {
  const genre = req.query.genre;
  const type = req.query.type;
  const q = (req.query.q || '').toLowerCase().trim();

  let results = [...TITLES];

  if (genre && genre !== 'Trending') {
    results = results.filter(t => t.genre === genre);
  }
  if (type) {
    results = results.filter(t => t.type === type);
  }
  if (q) {
    results = results.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

app.get('/api/featured', (req, res) => {
  const featured = TITLES.filter(t => t.score >= 90).slice(0, 5);
  res.json(featured);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`what-to-watch running at http://localhost:${PORT}`);
});
