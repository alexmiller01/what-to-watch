const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

const TMDB = 'https://media.themoviedb.org/t/p';

const TITLES = [
  // ── Movies ──
  {
    id: 1, title: 'Sinners', year: 2025, rating: 'R',
    genre: 'Thriller', type: 'movie', duration: '2h 17m',
    image: `${TMDB}/w342/oN0o3owobFjePDc5vMdLRAd0jkd.jpg`,
    backdrop: `${TMDB}/w780/oN0o3owobFjePDc5vMdLRAd0jkd.jpg`,
    rt: 97, imdb: 7.5, yahoo: 94, trailer: '7joulECTx_U',
    description: 'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.',
    streaming: ['Max']
  },
  {
    id: 2, title: 'Oppenheimer', year: 2023, rating: 'R',
    genre: 'Drama', type: 'movie', duration: '3h 0m',
    image: `${TMDB}/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdrop: `${TMDB}/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    rt: 93, imdb: 8.2, yahoo: 91, trailer: 'bK6ldnjE3Y0',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    streaming: ['Peacock']
  },
  {
    id: 3, title: 'Dune: Part Two', year: 2024, rating: 'PG-13',
    genre: 'Sci-Fi', type: 'movie', duration: '2h 46m',
    image: `${TMDB}/w342/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg`,
    backdrop: `${TMDB}/w780/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg`,
    rt: 92, imdb: 8.4, yahoo: 90, trailer: 'Way9Dexny3w',
    description: 'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    streaming: ['Max']
  },
  {
    id: 4, title: 'A Complete Unknown', year: 2024, rating: 'R',
    genre: 'Drama', type: 'movie', duration: '2h 21m',
    image: `${TMDB}/w342/lZGOK0I2DJSRlEPNOAFTSNxSjDD.jpg`,
    backdrop: `${TMDB}/w780/lZGOK0I2DJSRlEPNOAFTSNxSjDD.jpg`,
    rt: 79, imdb: 7.3, yahoo: 82, trailer: 'FdV-Cs5o8mc',
    description: 'Set in the early 1960s, a 19-year-old Bob Dylan arrives in New York City with his guitar and revolutionary talent, destined to change the course of American music.',
    streaming: ['Hulu']
  },
  {
    id: 5, title: 'Beetlejuice Beetlejuice', year: 2024, rating: 'PG-13',
    genre: 'Comedy', type: 'movie', duration: '1h 44m',
    image: `${TMDB}/w342/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg`,
    backdrop: `${TMDB}/w780/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg`,
    rt: 77, imdb: 6.6, yahoo: 78, trailer: 'CoZqL9N6Rx4',
    description: 'After a family tragedy, three generations of the Deetz family return home to Winter River, where Beetlejuice is unleashed once again.',
    streaming: ['Max']
  },
  {
    id: 6, title: 'Alien: Romulus', year: 2024, rating: 'R',
    genre: 'Horror', type: 'movie', duration: '1h 59m',
    image: `${TMDB}/w342/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg`,
    backdrop: `${TMDB}/w780/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg`,
    rt: 80, imdb: 7.3, yahoo: 81, trailer: 'OzY2r2JXsDM',
    description: 'While scavenging the deep reaches of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
    streaming: ['Hulu']
  },
  {
    id: 7, title: 'Conclave', year: 2024, rating: 'PG',
    genre: 'Thriller', type: 'movie', duration: '2h 0m',
    image: `${TMDB}/w342/jf3YO8hOqGHCupsREf5qymYq1n.jpg`,
    backdrop: `${TMDB}/w780/jf3YO8hOqGHCupsREf5qymYq1n.jpg`,
    rt: 93, imdb: 7.6, yahoo: 89, trailer: 'JX9jasdi3ic',
    description: 'Following the unexpected death of the Pope, Cardinal Lawrence is tasked with managing the conclave to elect a new pope, uncovering secrets that could shake the Church.',
    streaming: ['Peacock']
  },
  {
    id: 8, title: 'Bad Boys: Ride or Die', year: 2024, rating: 'R',
    genre: 'Action', type: 'movie', duration: '1h 55m',
    image: `${TMDB}/w342/oGythE98MYleE6mZlGs5oBGkux1.jpg`,
    backdrop: `${TMDB}/w780/oGythE98MYleE6mZlGs5oBGkux1.jpg`,
    rt: 72, imdb: 6.5, yahoo: 75, trailer: 'hRFY_Fesa9Q',
    description: 'When their late police captain is framed, Lowrey and Burnett go rogue to investigate the conspiracy and clear his name.',
    streaming: ['Netflix']
  },
  {
    id: 9, title: 'Furiosa: A Mad Max Saga', year: 2024, rating: 'R',
    genre: 'Action', type: 'movie', duration: '2h 28m',
    image: `${TMDB}/w342/iADOJ8Zymht2JPMoy3R7xceZprc.jpg`,
    backdrop: `${TMDB}/w780/iADOJ8Zymht2JPMoy3R7xceZprc.jpg`,
    rt: 90, imdb: 7.6, yahoo: 88, trailer: 'XJMuhwVlca4',
    description: 'The origin story of the mighty warrior Furiosa, snatched from the Green Place and falling into the hands of Warlord Dementus before crossing paths with the Citadel.',
    streaming: ['Max']
  },
  {
    id: 10, title: 'The Wild Robot', year: 2024, rating: 'PG',
    genre: 'Animation', type: 'movie', duration: '1h 42m',
    image: `${TMDB}/w342/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg`,
    backdrop: `${TMDB}/w780/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg`,
    rt: 98, imdb: 8.2, yahoo: 95, trailer: '67vbA5ZJdKQ',
    description: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt, eventually adopting an orphaned gosling.',
    streaming: ['Peacock']
  },
  {
    id: 11, title: 'Flow', year: 2024, rating: 'PG',
    genre: 'Animation', type: 'movie', duration: '1h 25m',
    image: `${TMDB}/w342/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg`,
    backdrop: `${TMDB}/w780/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg`,
    rt: 95, imdb: 8.3, yahoo: 93, trailer: 'ZgZccxuj2RY',
    description: 'A solitary cat, displaced by a great flood, finds refuge on a boat with a group of diverse animals and must overcome its differences to survive.',
    streaming: ['Prime Video']
  },
  {
    id: 12, title: 'Kingdom of the Planet of the Apes', year: 2024, rating: 'PG-13',
    genre: 'Sci-Fi', type: 'movie', duration: '2h 25m',
    image: `${TMDB}/w342/gKkl37BQuKTanygYQG1pyYgLVgf.jpg`,
    backdrop: `${TMDB}/w780/gKkl37BQuKTanygYQG1pyYgLVgf.jpg`,
    rt: 80, imdb: 7.0, yahoo: 79, trailer: 'Kdr5oedn7q8',
    description: 'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he\'s been taught about the past.',
    streaming: ['Hulu']
  },
  {
    id: 13, title: 'Kung Fu Panda 4', year: 2024, rating: 'PG',
    genre: 'Animation', type: 'movie', duration: '1h 34m',
    image: `${TMDB}/w342/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg`,
    backdrop: `${TMDB}/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg`,
    rt: 71, imdb: 6.4, yahoo: 74, trailer: '_inKs4eeHiI',
    description: 'Po must train a new Dragon Warrior before he can take over as the Spiritual Leader of the Valley of Peace.',
    streaming: ['Peacock']
  },
  {
    id: 14, title: 'The Crow', year: 2024, rating: 'R',
    genre: 'Action', type: 'movie', duration: '1h 51m',
    image: `${TMDB}/w342/g8TbOXrNMuqq7AaKqdvqS2oG4ob.jpg`,
    backdrop: `${TMDB}/w780/g8TbOXrNMuqq7AaKqdvqS2oG4ob.jpg`,
    rt: 23, imdb: 5.3, yahoo: 42, trailer: 'HKC2AG14M8A',
    description: 'Two soulmates are brutally murdered. Given a second chance at life, Eric sets out on a path of revenge, becoming an unstoppable force.',
    streaming: ['Prime Video']
  },
  {
    id: 15, title: 'Venom: The Last Dance', year: 2024, rating: 'PG-13',
    genre: 'Action', type: 'movie', duration: '1h 49m',
    image: `${TMDB}/w342/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg`,
    backdrop: `${TMDB}/w780/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg`,
    rt: 41, imdb: 6.1, yahoo: 55, trailer: 'STScKOUpXR8',
    description: 'Eddie and Venom, on the run from both of their worlds, face a devastating choice as the net closes in.',
    streaming: ['Netflix']
  },

  // ── TV Shows ──
  {
    id: 101, title: 'The Bear', year: 2024, rating: 'TV-MA',
    genre: 'Drama', type: 'series', duration: '3 Seasons',
    image: `${TMDB}/w342/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg`,
    backdrop: `${TMDB}/w780/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg`,
    rt: 93, imdb: 8.5, yahoo: 92, trailer: 'gBmkI4jlaIo',
    description: 'A young chef from the fine dining world returns to Chicago to run his deceased brother\'s Italian beef sandwich shop.',
    streaming: ['Hulu']
  },
  {
    id: 102, title: 'Severance', year: 2025, rating: 'TV-MA',
    genre: 'Thriller', type: 'series', duration: '2 Seasons',
    image: `${TMDB}/w342/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg`,
    backdrop: `${TMDB}/w780/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg`,
    rt: 97, imdb: 8.5, yahoo: 95, trailer: '_UXKlYvLGJY',
    description: 'Mark leads a team at Lumon Industries where employees have their memories surgically divided between work and personal lives.',
    streaming: ['Apple TV+']
  },
  {
    id: 103, title: 'House of the Dragon', year: 2024, rating: 'TV-MA',
    genre: 'Drama', type: 'series', duration: '2 Seasons',
    image: `${TMDB}/w342/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg`,
    backdrop: `${TMDB}/w780/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg`,
    rt: 87, imdb: 8.3, yahoo: 85, trailer: 'DTB8lATvXkw',
    description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
    streaming: ['Max']
  },
  {
    id: 104, title: 'Squid Game', year: 2024, rating: 'TV-MA',
    genre: 'Thriller', type: 'series', duration: '2 Seasons',
    image: `${TMDB}/w342/eiJeWeCAEZAmRppnXHiTWDcCd3Q.jpg`,
    backdrop: `${TMDB}/w780/eiJeWeCAEZAmRppnXHiTWDcCd3Q.jpg`,
    rt: 85, imdb: 8.0, yahoo: 84, trailer: 'lQBmZBJCYcY',
    description: 'Hundreds of cash-strapped players accept an invitation to compete in children\'s games for a tempting prize, with deadly stakes.',
    streaming: ['Netflix']
  },
  {
    id: 105, title: 'The Last of Us', year: 2025, rating: 'TV-MA',
    genre: 'Drama', type: 'series', duration: '2 Seasons',
    image: `${TMDB}/w342/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg`,
    backdrop: `${TMDB}/w780/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg`,
    rt: 92, imdb: 8.8, yahoo: 90, trailer: '_zHPsmXCjB0',
    description: 'Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone across a post-apocalyptic United States.',
    streaming: ['Max']
  },
  {
    id: 106, title: 'The Boys', year: 2024, rating: 'TV-MA',
    genre: 'Action', type: 'series', duration: '4 Seasons',
    image: `${TMDB}/w342/in1R2dDc421JxsoRWaIIAqVI2KE.jpg`,
    backdrop: `${TMDB}/w780/in1R2dDc421JxsoRWaIIAqVI2KE.jpg`,
    rt: 93, imdb: 8.7, yahoo: 91, trailer: 'EzFXDvC-EwM',
    description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers for fame and profit.',
    streaming: ['Prime Video']
  },
  {
    id: 107, title: 'Breaking Bad', year: 2013, rating: 'TV-MA',
    genre: 'Drama', type: 'series', duration: '5 Seasons',
    image: `${TMDB}/w342/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg`,
    backdrop: `${TMDB}/w780/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg`,
    rt: 96, imdb: 9.5, yahoo: 97, trailer: 'HhesaQXLuRY',
    description: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing crystal meth to secure his family\'s future.',
    streaming: ['Netflix']
  },
  {
    id: 108, title: 'The Rings of Power', year: 2024, rating: 'TV-14',
    genre: 'Sci-Fi', type: 'series', duration: '2 Seasons',
    image: `${TMDB}/w342/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg`,
    backdrop: `${TMDB}/w780/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg`,
    rt: 76, imdb: 6.9, yahoo: 72, trailer: 'gUwboXm0t3U',
    description: 'Epic drama set thousands of years before the events of The Hobbit and The Lord of the Rings, following an ensemble cast of characters.',
    streaming: ['Prime Video']
  },
  {
    id: 109, title: 'Game of Thrones', year: 2019, rating: 'TV-MA',
    genre: 'Drama', type: 'series', duration: '8 Seasons',
    image: `${TMDB}/w342/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg`,
    backdrop: `${TMDB}/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg`,
    rt: 89, imdb: 9.2, yahoo: 90, trailer: 'bjqEWgDVPe0',
    description: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    streaming: ['Max']
  },
  {
    id: 110, title: 'Yellowjackets', year: 2025, rating: 'TV-MA',
    genre: 'Thriller', type: 'series', duration: '3 Seasons',
    image: `${TMDB}/w342/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg`,
    backdrop: `${TMDB}/w780/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg`,
    rt: 88, imdb: 7.8, yahoo: 86, trailer: 'x8FUUxj6yOA',
    description: 'A wildly talented high school girls soccer team survives a plane crash deep in the Ontario wilderness, leading to a descent into savagery.',
    streaming: ['Paramount+']
  },
  {
    id: 111, title: 'The Agency', year: 2024, rating: 'TV-MA',
    genre: 'Thriller', type: 'series', duration: '1 Season',
    image: `${TMDB}/w342/ltG0kMlDcy84AxYekX7Cqr0JCAT.jpg`,
    backdrop: `${TMDB}/w780/ltG0kMlDcy84AxYekX7Cqr0JCAT.jpg`,
    rt: 72, imdb: 6.8, yahoo: 70, trailer: 'pAxMy31nffA',
    description: 'A covert CIA agent is ordered to abandon his undercover identity and return to London Station, reigniting a past love.',
    streaming: ['Paramount+']
  },
  {
    id: 112, title: 'Lucifer', year: 2021, rating: 'TV-14',
    genre: 'Comedy', type: 'series', duration: '6 Seasons',
    image: `${TMDB}/w342/ekZobS8isE6mA53RAiGDG93hBxL.jpg`,
    backdrop: `${TMDB}/w780/ekZobS8isE6mA53RAiGDG93hBxL.jpg`,
    rt: 85, imdb: 8.1, yahoo: 83, trailer: 'ueMwVGBwqRo',
    description: 'Bored and unhappy as the Lord of Hell, Lucifer Morningstar abandons his throne to retire in Los Angeles, where he helps the LAPD punish criminals.',
    streaming: ['Netflix']
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
