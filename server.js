const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

const T = 'https://media.themoviedb.org/t/p';

function m(id, title, year, rating, genre, duration, poster, rt, imdb, yahoo, trailer, rtSlug, imdbId) {
  return {
    id, title, year, rating, genre, type: 'movie', duration,
    image: `${T}/w342${poster}`, backdrop: `${T}/w780${poster}`,
    rt, imdb, yahoo, trailer,
    rtUrl: `https://www.rottentomatoes.com/m/${rtSlug}`,
    imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
    description: '', streaming: []
  };
}

function s(id, title, year, rating, genre, duration, poster, rt, imdb, yahoo, trailer, rtSlug, imdbId) {
  return {
    id, title, year, rating, genre, type: 'series', duration,
    image: `${T}/w342${poster}`, backdrop: `${T}/w780${poster}`,
    rt, imdb, yahoo, trailer,
    rtUrl: `https://www.rottentomatoes.com/tv/${rtSlug}`,
    imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
    description: '', streaming: []
  };
}

const DESC = {
  1: 'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.',
  2: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
  3: 'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
  4: 'Set in the early 1960s, a 19-year-old Bob Dylan arrives in New York City with his guitar and revolutionary talent.',
  5: 'After a family tragedy, three generations of the Deetz family return home to Winter River, where Beetlejuice is unleashed once again.',
  6: 'While scavenging a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
  7: 'Following the unexpected death of the Pope, Cardinal Lawrence is tasked with managing the conclave to elect a new pope.',
  8: 'When their late police captain is framed, Lowrey and Burnett go rogue to investigate the conspiracy and clear his name.',
  9: 'The origin story of the mighty warrior Furiosa, snatched from the Green Place and falling into the hands of Warlord Dementus.',
  10: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt.',
  11: 'A solitary cat, displaced by a great flood, finds refuge on a boat with a group of diverse animals.',
  12: 'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything.',
  13: 'Po must train a new Dragon Warrior before he can take over as the Spiritual Leader of the Valley of Peace.',
  14: 'Two soulmates are brutally murdered. Given a second chance at life, Eric sets out on a path of revenge.',
  15: 'Eddie and Venom, on the run from both of their worlds, face a devastating choice as the net closes in.',
  16: 'A couple travels to Sweden for a midsummer festival that turns into an increasingly violent and bizarre pagan ritual.',
  17: 'The legendary superhero-attorney Spider-Man is finally unmasked and must deal with the fallout.',
  18: 'John Wick uncovers a path to defeating The High Table but must face a new enemy with powerful alliances.',
  19: 'Barbie and Ken leave Barbieland to explore the real world and discover the joys and perils of living among humans.',
  20: 'Members of the Osage Nation are murdered under mysterious circumstances in 1920s Oklahoma, sparking a major FBI investigation.',
  21: 'Riley enters puberty, and new emotions join the headquarters — Anxiety, Envy, Ennui, and Embarrassment.',
  22: 'In a city where fire, water, earth, and air residents live together, a fiery young woman and a go-with-the-flow guy discover something elemental.',
  23: 'A family of ducks persuades their overprotective father to go on the vacation of a lifetime.',
  24: 'Art the Clown returns to terrorize the residents of Miles County on Christmas Eve.',
  25: 'A fading celebrity decides to use a black-market drug, a cell-replicating substance that temporarily creates a younger version of herself.',
  26: 'Godzilla and Kong must team up against a colossal undiscovered threat hidden within our world.',
  27: 'When a mysterious force alters the orbit of the moon, NASA sends a team on an impossible mission into space.',
  28: 'Five Nights at Freddy\'s follows a troubled security guard as he begins working at a deserted pizza restaurant.',
  29: 'A garfield movie adventure with the beloved cat and his owner Jon.',
  30: 'Moana sets sail on a new voyage with a crew of unlikely seafarers, journeying to far-flung waters of Oceania.',
  101: 'A young chef from the fine dining world returns to Chicago to run his deceased brother\'s Italian beef sandwich shop.',
  102: 'Mark leads a team at Lumon Industries where employees have their memories surgically divided between work and personal lives.',
  103: 'An internal succession war within House Targaryen at the height of its power, 172 years before Daenerys Targaryen.',
  104: 'Hundreds of cash-strapped players accept an invitation to compete in children\'s games for a tempting prize, with deadly stakes.',
  105: 'Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, across a post-apocalyptic United States.',
  106: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers for fame and profit.',
  107: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing crystal meth to secure his family\'s future.',
  108: 'Epic drama set thousands of years before The Hobbit and The Lord of the Rings.',
  109: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns.',
  110: 'A wildly talented high school girls soccer team survives a plane crash deep in the Ontario wilderness.',
  111: 'A covert CIA agent is ordered to abandon his undercover identity and return to London Station.',
  112: 'Bored and unhappy as the Lord of Hell, Lucifer Morningstar abandons his throne to retire in Los Angeles.',
  113: 'Stranger Things follows a group of kids in the 1980s who encounter supernatural forces and secret government exploits.',
  114: 'A bounty hunter travels the galaxy in the aftermath of the fall of the Galactic Empire.',
  115: 'Rick and Morty follows the misadventures of a cynical mad scientist and his good-hearted grandson.',
  116: 'A visionary mathematician and a warrior join forces to save galactic civilization from collapse.',
  117: 'Set in a dystopian future, a woman is forced into servitude as a handmaid under a totalitarian regime.',
  118: 'A monster hunter struggles to find his place in a world where humans and magical creatures coexist.',
  119: 'Vikings follows legendary Norse hero Ragnar Lothbrok as he rises from farmer to fearless warrior.',
  120: 'Better Call Saul follows small-time lawyer Jimmy McGill\'s transformation into the morally challenged Saul Goodman.',
  121: 'Former bouncer-turned-mobster Oz Cobb rises through the Gotham underworld.',
  122: 'An international crew of thieves pull off the biggest heist in recorded history.',
};

const TITLES = [
  // ── Thriller movies ──
  m(1,'Sinners',2025,'R','Thriller','2h 17m','/705nQHqe4JGdEisrQmVYmXyjs1U.jpg',97,7.5,94,'7joulECTx_U','sinners_2025','tt31193180'),
  m(7,'Conclave',2024,'PG','Thriller','2h 0m','/jf3YO8hOqGHCupsREf5qymYq1n.jpg',93,7.6,89,'JX9jasdi3ic','conclave','tt20215234'),
  m(25,'The Substance',2024,'R','Thriller','2h 20m','/lqoMzCcZYEFK729d6qzt349fB4o.jpg',89,7.3,87,'','the_substance','tt17526714'),
  m(16,'Midsommar',2019,'R','Thriller','2h 28m','/9bXHaLlsFYpJUutg4E6WXAjaxDi.jpg',83,7.1,80,'','midsommar','tt8772262'),
  m(28,'Five Nights at Freddy\'s',2023,'PG-13','Thriller','1h 50m','/7BpNtNfxuocYEVREzVMO75hso1l.jpg',32,5.4,45,'',  'five_nights_at_freddys','tt3513498'),
  m(20,'Killers of the Flower Moon',2023,'R','Thriller','3h 26m','/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',93,7.7,91,'','killers_of_the_flower_moon','tt5906664'),

  // ── Drama movies ──
  m(2,'Oppenheimer',2023,'R','Drama','3h 0m','/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',93,8.2,91,'bK6ldnjE3Y0','oppenheimer_2023','tt15398776'),
  m(4,'A Complete Unknown',2024,'R','Drama','2h 21m','/lZGOK0I2DJSRlEPNOAFTSNxSjDD.jpg',79,7.3,82,'FdV-Cs5o8mc','a_complete_unknown','tt11563598'),
  m(19,'Barbie',2023,'PG-13','Drama','1h 54m','/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',88,6.8,85,'','barbie','tt1517268'),
  m(27,'Interstellar',2014,'PG-13','Drama','2h 49m','/7fR3KxswtY8OHHZuOUB9td58CRX.jpg',73,8.7,88,'','interstellar_2014','tt0816692'),
  m(31,'Dune',2021,'PG-13','Drama','2h 35m','/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg',83,8.0,84,'','dune_2021','tt1160419'),

  // ── Action movies ──
  m(8,'Bad Boys: Ride or Die',2024,'R','Action','1h 55m','/oGythE98MYleE6mZlGs5oBGkux1.jpg',72,6.5,75,'hRFY_Fesa9Q','bad_boys_ride_or_die','tt4919268'),
  m(9,'Furiosa: A Mad Max Saga',2024,'R','Action','2h 28m','/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',90,7.6,88,'XJMuhwVlca4','furiosa_a_mad_max_saga','tt12037194'),
  m(14,'The Crow',2024,'R','Action','1h 51m','/g8TbOXrNMuqq7AaKqdvqS2oG4ob.jpg',23,5.3,42,'HKC2AG14M8A','the_crow_2024','tt1922936'),
  m(15,'Venom: The Last Dance',2024,'PG-13','Action','1h 49m','/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg',41,6.1,55,'STScKOUpXR8','venom_the_last_dance','tt16366836'),
  m(17,'Spider-Man: No Way Home',2021,'PG-13','Action','2h 28m','/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',93,8.2,92,'','spider_man_no_way_home','tt10872600'),
  m(18,'John Wick: Chapter 4',2023,'R','Action','2h 49m','/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',94,7.7,91,'','john_wick_chapter_4','tt10366206'),
  m(26,'Godzilla x Kong',2024,'PG-13','Action','1h 55m','/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',55,6.3,62,'','godzilla_x_kong_the_new_empire','tt14539740'),
  m(32,'Red One',2024,'PG-13','Action','2h 3m','/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg',31,6.2,48,'','red_one','tt14948432'),

  // ── Comedy movies ──
  m(5,'Beetlejuice Beetlejuice',2024,'PG-13','Comedy','1h 44m','/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg',77,6.6,78,'CoZqL9N6Rx4','beetlejuice_beetlejuice','tt2049403'),
  m(29,'The Garfield Movie',2024,'PG','Comedy','1h 41m','/xYduFGuch9OwbCOEUiamml18ZoB.jpg',36,5.7,45,'','the_garfield_movie','tt5779228'),

  // ── Sci-Fi movies ──
  m(3,'Dune: Part Two',2024,'PG-13','Sci-Fi','2h 46m','/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',92,8.4,90,'Way9Dexny3w','dune_part_two','tt15239678'),
  m(12,'Kingdom of the Planet of the Apes',2024,'PG-13','Sci-Fi','2h 25m','/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',80,7.0,79,'Kdr5oedn7q8','kingdom_of_the_planet_of_the_apes','tt11389872'),

  // ── Horror movies ──
  m(6,'Alien: Romulus',2024,'R','Horror','1h 59m','/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg',80,7.3,81,'OzY2r2JXsDM','alien_romulus','tt18412256'),
  m(24,'Terrifier 3',2024,'R','Horror','2h 5m','/ju10W5gl3PPK3b7TjEmVOZap51I.jpg',76,6.5,70,'','terrifier_3','tt27911000'),

  // ── Animation movies ──
  m(10,'The Wild Robot',2024,'PG','Animation','1h 42m','/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',98,8.2,95,'67vbA5ZJdKQ','the_wild_robot','tt29623480'),
  m(11,'Flow',2024,'PG','Animation','1h 25m','/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg',95,8.3,93,'ZgZccxuj2RY','flow_2024','tt4539740'),
  m(13,'Kung Fu Panda 4',2024,'PG','Animation','1h 34m','/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',71,6.4,74,'_inKs4eeHiI','kung_fu_panda_4','tt21692408'),
  m(21,'Inside Out 2',2024,'PG','Animation','1h 40m','/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',91,7.6,89,'','inside_out_2','tt22022452'),
  m(22,'Elemental',2023,'PG','Animation','1h 41m','/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg',74,7.0,75,'','elemental_2023','tt15789038'),
  m(23,'Migration',2023,'PG','Animation','1h 23m','/ldfCF9RhR40mppkzmftxapaHeTo.jpg',56,6.6,62,'','migration_2023','tt6495056'),
  m(30,'Moana 2',2024,'PG','Animation','1h 40m','/gUREuXCnJLVHsvKXDH9fgIcfM6e.jpg',63,5.8,65,'','moana_2','tt13622970'),

  // ── Romance movies ──

  // ── TV Shows ──
  // Drama
  s(101,'The Bear',2024,'TV-MA','Drama','3 Seasons','/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg',93,8.5,92,'gBmkI4jlaIo','the_bear','tt14452776'),
  s(103,'House of the Dragon',2024,'TV-MA','Drama','2 Seasons','/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',87,8.3,85,'DTB8lATvXkw','house_of_the_dragon','tt11198330'),
  s(105,'The Last of Us',2025,'TV-MA','Drama','2 Seasons','/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg',92,8.8,90,'_zHPsmXCjB0','the_last_of_us','tt3581920'),
  s(107,'Breaking Bad',2013,'TV-MA','Drama','5 Seasons','/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',96,9.5,97,'HhesaQXLuRY','breaking_bad','tt0903747'),
  s(109,'Game of Thrones',2019,'TV-MA','Drama','8 Seasons','/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',89,9.2,90,'bjqEWgDVPe0','game_of_thrones','tt0944947'),
  s(119,'Vikings',2020,'TV-MA','Drama','6 Seasons','/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg',93,8.5,88,'','vikings','tt2306299'),
  s(120,'Better Call Saul',2022,'TV-MA','Drama','6 Seasons','/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',99,9.0,96,'','better_call_saul','tt3032476'),
  s(117,'The Handmaid\'s Tale',2024,'TV-MA','Drama','5 Seasons','/eGUT7j3n3rn5yGihlCgwUnD70HV.jpg',83,8.4,82,'','the_handmaids_tale','tt5834204'),

  // Thriller
  s(102,'Severance',2025,'TV-MA','Thriller','2 Seasons','/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg',97,8.5,95,'_UXKlYvLGJY','severance','tt11280740'),
  s(104,'Squid Game',2024,'TV-MA','Thriller','2 Seasons','/eiJeWeCAEZAmRppnXHiTWDcCd3Q.jpg',85,8.0,84,'lQBmZBJCYcY','squid_game','tt10919420'),
  s(110,'Yellowjackets',2025,'TV-MA','Thriller','3 Seasons','/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg',88,7.8,86,'x8FUUxj6yOA','yellowjackets','tt11041332'),
  s(111,'The Agency',2024,'TV-MA','Thriller','1 Season','/ltG0kMlDcy84AxYekX7Cqr0JCAT.jpg',72,6.8,70,'pAxMy31nffA','the_agency_2024','tt27995594'),
  s(121,'The Penguin',2024,'TV-MA','Thriller','1 Season','/6HanIV2hTLE2w7A5bI1KJb3bTL7.jpg',94,8.5,92,'','the_penguin','tt15435876'),
  s(122,'Money Heist',2021,'TV-MA','Thriller','5 Seasons','/QWbPaDxiB6LW2LjASknzYBvjMj.jpg',83,8.2,81,'','money_heist','tt6468322'),
  s(113,'Stranger Things',2025,'TV-14','Thriller','4 Seasons','/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',92,8.7,90,'','stranger_things','tt4574334'),

  // Action
  s(106,'The Boys',2024,'TV-MA','Action','4 Seasons','/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',93,8.7,91,'EzFXDvC-EwM','the_boys','tt1190634'),
  s(114,'The Mandalorian',2023,'TV-PG','Action','3 Seasons','/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',89,8.7,88,'','the_mandalorian','tt8111088'),
  s(118,'The Witcher',2023,'TV-MA','Action','3 Seasons','/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg',70,8.0,74,'','the_witcher','tt5180504'),

  // Sci-Fi
  s(108,'The Rings of Power',2024,'TV-14','Sci-Fi','2 Seasons','/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg',76,6.9,72,'gUwboXm0t3U','the_lord_of_the_rings_the_rings_of_power','tt7631058'),
  s(116,'Foundation',2024,'TV-14','Sci-Fi','2 Seasons','/tg9I5pOY4M9CKj8U0cxVBTsm5eh.jpg',72,7.3,74,'','foundation','tt0804484'),

  // Comedy
  s(112,'Lucifer',2021,'TV-14','Comedy','6 Seasons','/ekZobS8isE6mA53RAiGDG93hBxL.jpg',85,8.1,83,'ueMwVGBwqRo','lucifer','tt4052886'),
  s(115,'Rick and Morty',2024,'TV-MA','Comedy','7 Seasons','/WGRQ8FpjkDTzivQJ43t94bOuY0.jpg',93,9.1,92,'','rick_and_morty','tt2861424'),

  // Horror
  s(123,'The Walking Dead',2022,'TV-MA','Horror','11 Seasons','/s3OIDrCErUjthsnPPreY7XktQXB.jpg',80,8.1,78,'','the_walking_dead','tt1520211'),
];

TITLES.forEach(t => { if (DESC[t.id]) t.description = DESC[t.id]; });

app.get('/api/titles', (req, res) => {
  res.json(TITLES);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`what-to-watch running at http://localhost:${PORT}`);
});
