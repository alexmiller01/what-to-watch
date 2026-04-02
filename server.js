const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

const TMDB_IMG = 'https://media.themoviedb.org/t/p/w342';

const TITLES = [
  // ── Movies ──
  {
    id: 1, title: 'Sinners', year: 2025, rating: 'R',
    score: 89, genre: 'Thriller', type: 'movie',
    image: `${TMDB_IMG}/oN0o3owobFjePDc5vMdLRAd0jkd.jpg`,
    description: 'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.',
    streaming: ['Max'], duration: '2h 17m'
  },
  {
    id: 2, title: 'Oppenheimer', year: 2023, rating: 'R',
    score: 93, genre: 'Drama', type: 'movie',
    image: `${TMDB_IMG}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    description: 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.',
    streaming: ['Peacock'], duration: '3h 0m'
  },
  {
    id: 3, title: 'Dune: Part Two', year: 2024, rating: 'PG-13',
    score: 92, genre: 'Sci-Fi', type: 'movie',
    image: `${TMDB_IMG}/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg`,
    description: 'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family.',
    streaming: ['Max'], duration: '2h 46m'
  },
  {
    id: 4, title: 'A Complete Unknown', year: 2024, rating: 'R',
    score: 88, genre: 'Drama', type: 'movie',
    image: `${TMDB_IMG}/lZGOK0I2DJSRlEPNOAFTSNxSjDD.jpg`,
    description: 'The story of Bob Dylan\'s meteoric rise as a folk singer in early 1960s New York.',
    streaming: ['Hulu'], duration: '2h 21m'
  },
  {
    id: 5, title: 'Beetlejuice Beetlejuice', year: 2024, rating: 'PG-13',
    score: 77, genre: 'Comedy', type: 'movie',
    image: `${TMDB_IMG}/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg`,
    description: 'After a family tragedy, three generations of the Deetz family return home to Winter River.',
    streaming: ['Max'], duration: '1h 44m'
  },
  {
    id: 6, title: 'Alien: Romulus', year: 2024, rating: 'R',
    score: 80, genre: 'Horror', type: 'movie',
    image: `${TMDB_IMG}/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg`,
    description: 'A group of young colonists encounter the most terrifying life form in the universe.',
    streaming: ['Hulu'], duration: '1h 59m'
  },
  {
    id: 7, title: 'Conclave', year: 2024, rating: 'PG',
    score: 93, genre: 'Thriller', type: 'movie',
    image: `${TMDB_IMG}/jf3YO8hOqGHCupsREf5qymYq1n.jpg`,
    description: 'Cardinals locked in the Sistine Chapel to elect a new pope uncover secrets that could shake the Church.',
    streaming: ['Peacock'], duration: '2h 0m'
  },
  {
    id: 8, title: 'Bad Boys: Ride or Die', year: 2024, rating: 'R',
    score: 72, genre: 'Action', type: 'movie',
    image: `${TMDB_IMG}/oGythE98MYleE6mZlGs5oBGkux1.jpg`,
    description: 'When their late captain is framed, Mike and Marcus go rogue to investigate a conspiracy.',
    streaming: ['Netflix'], duration: '1h 55m'
  },
  {
    id: 9, title: 'Furiosa: A Mad Max Saga', year: 2024, rating: 'R',
    score: 90, genre: 'Action', type: 'movie',
    image: `${TMDB_IMG}/iADOJ8Zymht2JPMoy3R7xceZprc.jpg`,
    description: 'The origin story of the mighty warrior Furiosa before she teamed up with Mad Max.',
    streaming: ['Max'], duration: '2h 28m'
  },
  {
    id: 10, title: 'The Wild Robot', year: 2024, rating: 'PG',
    score: 98, genre: 'Animation', type: 'movie',
    image: `${TMDB_IMG}/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg`,
    description: 'A robot shipwrecked on an uninhabited island must learn to adapt to a harsh environment.',
    streaming: ['Peacock'], duration: '1h 42m'
  },
  {
    id: 11, title: 'Flow', year: 2024, rating: 'PG',
    score: 95, genre: 'Animation', type: 'movie',
    image: `${TMDB_IMG}/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg`,
    description: 'A cat embarks on a journey through a flooded world alongside a group of animals.',
    streaming: ['Prime Video'], duration: '1h 25m'
  },
  {
    id: 12, title: 'Kingdom of the Planet of the Apes', year: 2024, rating: 'PG-13',
    score: 80, genre: 'Sci-Fi', type: 'movie',
    image: `${TMDB_IMG}/gKkl37BQuKTanygYQG1pyYgLVgf.jpg`,
    description: 'Many years after Caesar\'s reign, a young ape embarks on a journey that will determine the future.',
    streaming: ['Hulu'], duration: '2h 25m'
  },
  {
    id: 13, title: 'Kung Fu Panda 4', year: 2024, rating: 'PG',
    score: 71, genre: 'Animation', type: 'movie',
    image: `${TMDB_IMG}/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg`,
    description: 'Po must train a new Dragon Warrior before he can take on a powerful shape-shifting villain.',
    streaming: ['Peacock'], duration: '1h 34m'
  },
  {
    id: 14, title: 'The Crow', year: 2024, rating: 'R',
    score: 52, genre: 'Action', type: 'movie',
    image: `${TMDB_IMG}/g8TbOXrNMuqq7AaKqdvqS2oG4ob.jpg`,
    description: 'Soulmates are brutally murdered, and the man given a second chance becomes an unstoppable avenger.',
    streaming: ['Prime Video'], duration: '1h 51m'
  },
  {
    id: 15, title: 'Venom: The Last Dance', year: 2024, rating: 'PG-13',
    score: 60, genre: 'Action', type: 'movie',
    image: `${TMDB_IMG}/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg`,
    description: 'Eddie and Venom face their most dangerous enemy yet on the run from both worlds.',
    streaming: ['Netflix'], duration: '1h 49m'
  },

  // ── TV Shows ──
  {
    id: 101, title: 'The Bear', year: 2024, rating: 'TV-MA',
    score: 96, genre: 'Drama', type: 'series',
    image: `${TMDB_IMG}/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg`,
    description: 'A chef returns to Chicago to run his family sandwich shop after a tragedy.',
    streaming: ['Hulu'], duration: '3 Seasons'
  },
  {
    id: 102, title: 'Severance', year: 2025, rating: 'TV-MA',
    score: 97, genre: 'Thriller', type: 'series',
    image: `${TMDB_IMG}/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg`,
    description: 'Workers at Lumon Industries have their memories surgically divided between work and personal lives.',
    streaming: ['Apple TV+'], duration: '2 Seasons'
  },
  {
    id: 103, title: 'House of the Dragon', year: 2024, rating: 'TV-MA',
    score: 84, genre: 'Drama', type: 'series',
    image: `${TMDB_IMG}/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg`,
    description: 'The Targaryen civil war tears the realm apart as two sides battle for the Iron Throne.',
    streaming: ['Max'], duration: '2 Seasons'
  },
  {
    id: 104, title: 'Squid Game', year: 2024, rating: 'TV-MA',
    score: 95, genre: 'Thriller', type: 'series',
    image: `${TMDB_IMG}/eiJeWeCAEZAmRppnXHiTWDcCd3Q.jpg`,
    description: 'Hundreds of cash-strapped players accept an invitation to compete in children\'s games for a prize.',
    streaming: ['Netflix'], duration: '2 Seasons'
  },
  {
    id: 105, title: 'The Last of Us', year: 2025, rating: 'TV-MA',
    score: 96, genre: 'Drama', type: 'series',
    image: `${TMDB_IMG}/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg`,
    description: 'A hardened survivor and a teenage girl traverse a post-apocalyptic United States.',
    streaming: ['Max'], duration: '2 Seasons'
  },
  {
    id: 106, title: 'The Boys', year: 2024, rating: 'TV-MA',
    score: 93, genre: 'Action', type: 'series',
    image: `${TMDB_IMG}/in1R2dDc421JxsoRWaIIAqVI2KE.jpg`,
    description: 'A group of vigilantes set out to take down corrupt superheroes abusing their powers.',
    streaming: ['Prime Video'], duration: '4 Seasons'
  },
  {
    id: 107, title: 'Breaking Bad', year: 2013, rating: 'TV-MA',
    score: 97, genre: 'Drama', type: 'series',
    image: `${TMDB_IMG}/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg`,
    description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
    streaming: ['Netflix'], duration: '5 Seasons'
  },
  {
    id: 108, title: 'The Rings of Power', year: 2024, rating: 'TV-14',
    score: 76, genre: 'Sci-Fi', type: 'series',
    image: `${TMDB_IMG}/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg`,
    description: 'Epic drama set thousands of years before the events of The Lord of the Rings.',
    streaming: ['Prime Video'], duration: '2 Seasons'
  },
  {
    id: 109, title: 'Game of Thrones', year: 2019, rating: 'TV-MA',
    score: 89, genre: 'Drama', type: 'series',
    image: `${TMDB_IMG}/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg`,
    description: 'Noble families vie for control of the mythical land of Westeros.',
    streaming: ['Max'], duration: '8 Seasons'
  },
  {
    id: 110, title: 'Yellowjackets', year: 2025, rating: 'TV-MA',
    score: 88, genre: 'Thriller', type: 'series',
    image: `${TMDB_IMG}/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg`,
    description: 'A team of wildly talented high school soccer players survive a plane crash in the wilderness.',
    streaming: ['Paramount+'], duration: '3 Seasons'
  },
  {
    id: 111, title: 'The Agency', year: 2024, rating: 'TV-MA',
    score: 72, genre: 'Thriller', type: 'series',
    image: `${TMDB_IMG}/ltG0kMlDcy84AxYekX7Cqr0JCAT.jpg`,
    description: 'A covert CIA agent is ordered to abandon his undercover identity and return to London.',
    streaming: ['Paramount+'], duration: '1 Season'
  },
  {
    id: 112, title: 'Lucifer', year: 2021, rating: 'TV-14',
    score: 85, genre: 'Comedy', type: 'series',
    image: `${TMDB_IMG}/ekZobS8isE6mA53RAiGDG93hBxL.jpg`,
    description: 'The Devil moves to Los Angeles and assists the LAPD in punishing criminals.',
    streaming: ['Netflix'], duration: '6 Seasons'
  }
];

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`what-to-watch running at http://localhost:${PORT}`);
});
