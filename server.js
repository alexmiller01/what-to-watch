const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Authentication ──
const AUTH_SALT = 'wtw_2026_salt_k9x';
const PASSWORD_HASH = crypto.createHash('sha256').update('selfboyz4lyfe' + AUTH_SALT).digest('hex');
const sessions = new Map();
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

function verifyPassword(input) {
  const hash = crypto.createHash('sha256').update(input + AUTH_SALT).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(PASSWORD_HASH));
}

function createSession() {
  const token = crypto.randomBytes(48).toString('hex');
  sessions.set(token, { created: Date.now() });
  return token;
}

function isValidSession(token) {
  if (!token || !sessions.has(token)) return false;
  const session = sessions.get(token);
  if (Date.now() - session.created > SESSION_MAX_AGE) {
    sessions.delete(token);
    return false;
  }
  return true;
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get('/login', (req, res) => {
  if (isValidSession(req.cookies.wtw_session)) return res.redirect('/');
  res.send(getLoginPage());
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || !verifyPassword(password)) {
    return res.send(getLoginPage('Incorrect password'));
  }
  const token = createSession();
  res.cookie('wtw_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE
  });
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  if (req.cookies.wtw_session) sessions.delete(req.cookies.wtw_session);
  res.clearCookie('wtw_session');
  res.redirect('/login');
});

app.use((req, res, next) => {
  if (req.path === '/assets/ryuken.png' || req.path === '/assets/Y!Logos Main.svg') return next();
  if (isValidSession(req.cookies.wtw_session)) return next();
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, 'public')));

function getLoginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What to Watch – Login</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Yahoo Product Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #000 url('/assets/ryuken.png') center center / cover no-repeat fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #141414;
    }
    .login-card {
      width: 100%;
      max-width: 380px;
      padding: 40px 32px;
      text-align: center;
      background: rgba(255, 255, 255, 0.92);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .login-logo { margin-bottom: 32px; }
    .login-logo img { height: 28px; }
    .login-title {
      font-size: 24px;
      font-weight: 500;
      line-height: 29px;
      margin-bottom: 8px;
    }
    .login-subtitle {
      font-size: 14px;
      color: #666;
      line-height: 20px;
      margin-bottom: 32px;
    }
    .login-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #cdcdcd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 16px;
      outline: none;
      transition: border-color 0.15s ease;
      -webkit-text-security: disc;
    }
    .login-input:focus { border-color: #7d2eff; }
    .login-input::placeholder { color: #999; }
    .login-btn {
      width: 100%;
      padding: 12px;
      margin-top: 16px;
      background: #141414;
      color: #fff;
      border: none;
      border-radius: 9999px;
      font-family: inherit;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .login-btn:hover { background: #333; }
    .login-error {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 12px;
    }
    .login-input.has-error { border-color: #d32f2f; }
  </style>
</head>
<body oncontextmenu="return false">
  <script>
    document.addEventListener('keydown',function(e){
      if(e.key==='F12')e.preventDefault();
      if(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='J'||e.key==='C'))e.preventDefault();
      if(e.metaKey&&e.altKey&&(e.key==='i'||e.key==='j'||e.key==='c'||e.key==='I'||e.key==='J'||e.key==='C'))e.preventDefault();
      if(e.ctrlKey&&e.key==='u')e.preventDefault();
      if(e.metaKey&&e.key==='u')e.preventDefault();
      if(e.metaKey&&e.altKey&&e.key==='u')e.preventDefault();
    });
    document.addEventListener('contextmenu',function(e){e.preventDefault();});
  </script>
  <div class="login-card">
    <div class="login-logo">
      <img src="/assets/Y!Logos Main.svg" alt="Yahoo">
    </div>
    <h1 class="login-title">What to Watch</h1>
    <p class="login-subtitle">Enter the password to continue</p>
    <form method="POST" action="/login" autocomplete="off">
      <input class="login-input${error ? ' has-error' : ''}" type="password" name="password" placeholder="Password" autofocus autocomplete="off">
      <button class="login-btn" type="submit">Continue</button>
      ${error ? '<p class="login-error">' + error + '</p>' : ''}
    </form>
  </div>
</body>
</html>`;
}

const T = 'https://media.themoviedb.org/t/p';

function ytThumb(trailerId) {
  return trailerId ? `https://img.youtube.com/vi/${trailerId}/hqdefault.jpg` : null;
}

function m(id, title, year, rating, genre, duration, poster, rt, imdb, yahoo, trailer, rtSlug, imdbId) {
  return {
    id, title, year, rating, genre, type: 'movie', duration,
    image: `${T}/w342${poster}`,
    backdrop: ytThumb(trailer) || `${T}/w780${poster}`,
    rt, imdb, yahoo, trailer,
    rtUrl: `https://www.rottentomatoes.com/m/${rtSlug}`,
    imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
    description: '', streaming: []
  };
}

function s(id, title, year, rating, genre, duration, poster, rt, imdb, yahoo, trailer, rtSlug, imdbId) {
  return {
    id, title, year, rating, genre, type: 'series', duration,
    image: `${T}/w342${poster}`,
    backdrop: ytThumb(trailer) || `${T}/w780${poster}`,
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
  31: 'Paul Atreides must navigate deadly politics and desert warfare to protect his family and fulfill his destiny on the planet Arrakis.',
  32: 'When Santa Claus is kidnapped, the North Pole\'s head of security teams up with a bounty hunter to save Christmas.',
  33: 'Stranded on Mars, an astronaut must use his wits and science to survive until rescue is possible.',
  34: 'When mysterious spacecraft touch down across the globe, a linguist races to decipher their intent before conflict erupts.',
  35: 'A young blade runner uncovers a secret that threatens to destabilize what remains of society in a dystopian future.',
  36: 'A computer hacker learns from rebels that the reality he knows is a simulated world controlled by machines.',
  37: 'A paraplegic Marine is sent to infiltrate the Na\'vi people of Pandora but begins to question his mission.',
  38: 'A young programmer is selected to evaluate a humanoid AI in a remote estate, with unsettling consequences.',
  39: 'A secret agent armed with time-inversion technology fights to prevent a future attack that could end the world.',
  40: 'An overwhelmed laundromat owner is swept into a wild multiverse adventure to save her family and existence itself.',
  41: 'Siblings running a California horse ranch witness something unexplainable in the sky and set out to capture proof.',
  42: 'A renowned detective investigates the death of a crime novelist at a gathering of his dysfunctional, wealthy family.',
  43: 'Benoit Blanc travels to a tech billionaire\'s private island where a murder disrupts an elaborate murder-mystery party.',
  44: 'The adventures of a legendary concierge at a famous European hotel between the wars and his loyal lobby boy.',
  45: 'The lives of two families intertwine in a darkly comic thriller about class, deception, and survival in modern Seoul.',
  46: 'A young Black man uncovers increasingly disturbing secrets when he meets his white girlfriend\'s family.',
  47: 'When his wife vanishes on their anniversary, a husband becomes the prime suspect in a media-circus investigation.',
  48: 'A couple travels to a remote island for an exclusive chef\'s tasting menu where the evening takes a shocking turn.',
  49: 'A family must live in near-total silence to hide from creatures that hunt by sound in a post-apocalyptic world.',
  50: 'After the death of their secretive grandmother, a family unravels as sinister forces close in on them.',
  51: 'A vacationing family is terrorized by their uncanny doppelgängers during a home invasion at their beach house.',
  52: 'A couple travels to Sweden for a midsummer festival that turns into an increasingly violent and bizarre pagan ritual.',
  53: 'The lives of two families intertwine in a darkly comic thriller about class, deception, and survival in modern Seoul.',
  54: 'A young Black man uncovers increasingly disturbing secrets when he meets his white girlfriend\'s family.',
  55: 'When his wife vanishes on their anniversary, a husband becomes the prime suspect in a media-circus investigation.',
  56: 'A couple travels to a remote island for an exclusive chef\'s tasting menu where the evening takes a shocking turn.',
  57: 'After thirty years, Maverick is called back to Top Gun to train a group of graduates for a dangerous specialized mission.',
  58: 'Two imprisoned men forge an unlikely bond over the years, finding solace and eventual redemption through acts of common decency.',
  59: 'A stage director and her actor husband struggle through a grueling coast-to-coast divorce that tests their bond as parents.',
  60: 'Two childhood friends from South Korea are reunited in New York decades later and must reckon with the paths they chose.',
  61: 'A world-renowned orchestra conductor faces allegations of misconduct that threaten to unravel her career and personal life.',
  62: 'A modern western drama centered on a powerful ranching family battling constant threats to their land and legacy.',
  63: 'Teen Miles Morales becomes the Spider-Man of his reality and crosses paths with counterparts from other dimensions.',
  64: 'A young boy journeys to the stunning Land of the Dead to unlock the mystery behind his family\'s generations-old ban on music.',
  65: 'A team of explorers travels through a wormhole near Saturn in search of a new home for humanity.',
  66: 'Ethan Hunt and the IMF team embark on their most dangerous mission yet to track down a terrifying new weapon.',
  67: 'Two U.S. marshals investigate the disappearance of a patient from a hospital for the criminally insane on a remote island.',
  68: 'A cartoonist becomes an amateur detective obsessed with tracking down the Zodiac killer terrorizing San Francisco.',
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
  123: 'Sheriff\'s deputy Rick Grimes awakens from a coma to find a post-apocalyptic world dominated by flesh-eating zombies.',
  124: 'An anthology series exploring a twisted, high-tech multiverse where humanity\'s greatest innovations collide with its darkest instincts.',
  125: 'In a ruined and toxic future, thousands live in a giant underground silo where strict rules keep them safe from the outside.',
  126: 'In the 24th century, a disparate crew aboard a salvaged ship uncovers a vast conspiracy threatening the entire Solar System.',
  127: 'Five years before A New Hope, Cassian Andor embarks on a path that transforms him into a rebel hero.',
  128: 'In the 26th century, a supersoldier battles an alien threat in a desperate war for humanity\'s survival.',
  129: 'Former Jedi Ahsoka Tano investigates an emerging threat to the galaxy following the fall of the Galactic Empire.',
  130: 'In a futuristic Wild West theme park, android hosts begin malfunctioning, leading guests on a dark odyssey of self-discovery.',
  131: 'An American football coach is hired to manage a struggling English soccer team despite having no experience with the sport.',
  132: 'A mockumentary following the everyday lives of office employees at the Scranton branch of Dunder Mifflin Paper Company.',
  133: 'The absurd antics of an idealistic public servant and her colleagues in the Parks Department of Pawnee, Indiana.',
  134: 'A group of vampire roommates navigate modern life in Staten Island, dealing with everyday challenges of being undead.',
  135: 'Princess Bean, her personal demon Luci, and companion Elfo navigate the crumbling medieval kingdom of Dreamland.',
  136: 'Four foul-mouthed fourth-graders in a small Colorado town encounter outrageous adventures laced with biting social commentary.',
  137: 'Detective Jake Peralta and his squad solve crimes and stir up laughs at Brooklyn\'s 99th precinct.',
  138: 'A former military police officer drifts into a small town and uncovers a deadly conspiracy far bigger than expected.',
  139: 'The self-aggrandizing Peacemaker believes in achieving peace at any cost and is recruited for dangerous black-ops missions.',
  140: 'A dysfunctional family of adopted superheroes reunites to solve the mystery of their father\'s death and prevent an apocalypse.',
  141: 'College student Mark Grayson inherits superpowers from his father, the most powerful hero on Earth, and discovers a horrifying secret.',
  142: 'Monkey D. Luffy and his ragtag pirate crew embark on an epic journey to find the legendary treasure, the One Piece.',
  143: 'A monster hunter struggles to find his place in a world where humans and magical creatures coexist.',
  144: 'An anthology series exploring different horror scenarios each season, from haunted houses to apocalyptic plagues.',
  145: 'Siblings who grew up in a haunted mansion are forced to confront the ghosts of their past and some that followed them.',
  146: 'Residents of a nightmarish town are trapped with no way out, surrounded by deadly creatures lurking in the surrounding forest.',
  147: 'A high school becomes ground zero for a zombie virus outbreak, and trapped students must fight to escape alive.',
  148: 'A group of kids in the 1980s encounter supernatural forces and secret government exploits in their small Indiana town.',
  149: 'The true story of the catastrophic 1986 nuclear disaster in the Soviet Union and the brave people who fought to contain it.',
  150: 'At a hospice for terminally ill teens, eight members of a midnight storytelling club search for signs of the supernatural.',
  151: 'A kind-hearted boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.',
  152: 'Amid the undercity of a gleaming utopia, two sisters find themselves on opposing sides of a war between magic and technology.',
  153: 'College student Mark Grayson inherits superpowers from his father, the most powerful hero on Earth, and discovers a horrifying secret.',
  154: 'Amid the undercity of a gleaming utopia, two sisters find themselves on opposing sides of a war between magic and technology.',
  155: 'A kind-hearted boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.',
  156: 'The misadventures of a cynical mad scientist and his good-hearted grandson across infinite dimensions.',
  157: 'Monkey D. Luffy and his ragtag pirate crew embark on an epic journey to find the legendary treasure, the One Piece.',
  158: 'Princess Bean, her personal demon Luci, and companion Elfo navigate the crumbling medieval kingdom of Dreamland.',
  159: 'Four foul-mouthed fourth-graders in a small Colorado town encounter outrageous adventures laced with biting social commentary.',
  160: 'An animated anthology series of short stories spanning science fiction, fantasy, horror, and comedy.',
  161: 'A bounty hunter travels the galaxy in the aftermath of the fall of the Galactic Empire.',
  162: 'The Dutton family, led by patriarch John Dutton, fights to protect their massive Montana ranch from those who seek to take it.',
  163: 'A dangerously charming, obsessive young man goes to extreme measures to insert himself into the lives of those he is drawn to.',
  164: 'Two FBI agents study the psychology of serial killers in the late 1970s to apply their insights to open cases.',
};

const TITLES = [
  // ── Thriller movies ──
  m(1,'Sinners',2025,'R','Thriller','2h 17m','/705nQHqe4JGdEisrQmVYmXyjs1U.jpg',97,7.5,94,'7joulECTx_U','sinners_2025','tt31193180'),
  m(7,'Conclave',2024,'PG','Thriller','2h 0m','/jf3YO8hOqGHCupsREf5qymYq1n.jpg',93,7.6,89,'JX9jasdi3ic','conclave','tt20215234'),
  m(25,'The Substance',2024,'R','Thriller','2h 20m','/lqoMzCcZYEFK729d6qzt349fB4o.jpg',89,7.3,87,'','the_substance','tt17526714'),
  m(16,'Midsommar',2019,'R','Thriller','2h 28m','/9bXHaLlsFYpJUutg4E6WXAjaxDi.jpg',83,7.1,80,'1Vnghdsjmd0','midsommar','tt8772262'),
  m(28,'Five Nights at Freddy\'s',2023,'PG-13','Thriller','1h 50m','/7BpNtNfxuocYEVREzVMO75hso1l.jpg',32,5.4,45,'0VH9WCFV6XQ','five_nights_at_freddys','tt3513498'),
  m(20,'Killers of the Flower Moon',2023,'R','Thriller','3h 26m','/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',93,7.7,91,'EP34Yoxs3FQ','killers_of_the_flower_moon','tt5906664'),

  // ── Drama movies ──
  m(2,'Oppenheimer',2023,'R','Drama','3h 0m','/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',93,8.2,91,'bK6ldnjE3Y0','oppenheimer_2023','tt15398776'),
  m(4,'A Complete Unknown',2024,'R','Drama','2h 21m','/lZGOK0I2DJSRlEPNOAFTSNxSjDD.jpg',79,7.3,82,'FdV-Cs5o8mc','a_complete_unknown','tt11563598'),
  m(19,'Barbie',2023,'PG-13','Drama','1h 54m','/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',88,6.8,85,'pBk4NYhWNMM','barbie','tt1517268'),
  m(27,'Interstellar',2014,'PG-13','Drama','2h 49m','/7fR3KxswtY8OHHZuOUB9td58CRX.jpg',73,8.7,88,'zSWdZVtXT7E','interstellar_2014','tt0816692'),
  m(31,'Dune',2021,'PG-13','Drama','2h 35m','/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg',83,8.0,84,'n9xhJrPXop4','dune_2021','tt1160419'),

  // ── Action movies ──
  m(8,'Bad Boys: Ride or Die',2024,'R','Action','1h 55m','/oGythE98MYleE6mZlGs5oBGkux1.jpg',72,6.5,75,'hRFY_Fesa9Q','bad_boys_ride_or_die','tt4919268'),
  m(9,'Furiosa: A Mad Max Saga',2024,'R','Action','2h 28m','/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',90,7.6,88,'XJMuhwVlca4','furiosa_a_mad_max_saga','tt12037194'),
  m(14,'The Crow',2024,'R','Action','1h 51m','/g8TbOXrNMuqq7AaKqdvqS2oG4ob.jpg',23,5.3,42,'HKC2AG14M8A','the_crow_2024','tt1922936'),
  m(15,'Venom: The Last Dance',2024,'PG-13','Action','1h 49m','/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg',41,6.1,55,'STScKOUpXR8','venom_the_last_dance','tt16366836'),
  m(17,'Spider-Man: No Way Home',2021,'PG-13','Action','2h 28m','/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',93,8.2,92,'JfVOs4VSpmA','spider_man_no_way_home','tt10872600'),
  m(18,'John Wick: Chapter 4',2023,'R','Action','2h 49m','/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',94,7.7,91,'qEVUtrk8_B4','john_wick_chapter_4','tt10366206'),
  m(26,'Godzilla x Kong',2024,'PG-13','Action','1h 55m','/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',55,6.3,62,'odM92ap8_c0','godzilla_x_kong_the_new_empire','tt14539740'),
  m(32,'Red One',2024,'PG-13','Action','2h 3m','/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg',31,6.2,48,'','red_one','tt14948432'),

  // ── Comedy movies ──
  m(5,'Beetlejuice Beetlejuice',2024,'PG-13','Comedy','1h 44m','/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg',77,6.6,78,'CoZqL9N6Rx4','beetlejuice_beetlejuice','tt2049403'),
  m(29,'The Garfield Movie',2024,'PG','Comedy','1h 41m','/xYduFGuch9OwbCOEUiamml18ZoB.jpg',36,5.7,45,'','the_garfield_movie','tt5779228'),

  // ── Sci-Fi movies ──
  m(3,'Dune: Part Two',2024,'PG-13','Sci-Fi','2h 46m','/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',92,8.4,90,'Way9Dexny3w','dune_part_two','tt15239678'),
  m(12,'Kingdom of the Planet of the Apes',2024,'PG-13','Sci-Fi','2h 25m','/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',80,7.0,79,'Kdr5oedn7q8','kingdom_of_the_planet_of_the_apes','tt11389872'),

  // ── Horror movies ──
  m(6,'Alien: Romulus',2024,'R','Horror','1h 59m','/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg',80,7.3,81,'OzY2r2JXsDM','alien_romulus','tt18412256'),
  m(24,'Terrifier 3',2024,'R','Horror','2h 5m','/ju10W5gl3PPK3b7TjEmVOZap51I.jpg',76,6.5,70,'0s2sPyUaJRc','terrifier_3','tt27911000'),

  // ── Animation movies ──
  m(10,'The Wild Robot',2024,'PG','Animation','1h 42m','/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',98,8.2,95,'67vbA5ZJdKQ','the_wild_robot','tt29623480'),
  m(11,'Flow',2024,'PG','Animation','1h 25m','/zME0Ul0w48MKkYBnFRn40M5qgLh.jpg',95,8.3,93,'ZgZccxuj2RY','flow_2024','tt4539740'),
  m(13,'Kung Fu Panda 4',2024,'PG','Animation','1h 34m','/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',71,6.4,74,'_inKs4eeHiI','kung_fu_panda_4','tt21692408'),
  m(21,'Inside Out 2',2024,'PG','Animation','1h 40m','/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',91,7.6,89,'LEjhY15eCx0','inside_out_2','tt22022452'),
  m(22,'Elemental',2023,'PG','Animation','1h 41m','/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg',74,7.0,75,'','elemental_2023','tt15789038'),
  m(23,'Migration',2023,'PG','Animation','1h 23m','/ldfCF9RhR40mppkzmftxapaHeTo.jpg',56,6.6,62,'SqmMCVYjfns','migration_2023','tt6495056'),
  m(30,'Moana 2',2024,'PG','Animation','1h 40m','/gUREuXCnJLVHsvKXDH9fgIcfM6e.jpg',63,5.8,65,'hDZ7y8RP5HE','moana_2','tt13622970'),

  // ── Romance movies ──

  // ── TV Shows ──
  // Drama
  s(101,'The Bear',2024,'TV-MA','Drama','3 Seasons','/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg',93,8.5,92,'gBmkI4jlaIo','the_bear','tt14452776'),
  s(103,'House of the Dragon',2024,'TV-MA','Drama','2 Seasons','/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',87,8.3,85,'DTB8lATvXkw','house_of_the_dragon','tt11198330'),
  s(105,'The Last of Us',2025,'TV-MA','Drama','2 Seasons','/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg',92,8.8,90,'_zHPsmXCjB0','the_last_of_us','tt3581920'),
  s(107,'Breaking Bad',2013,'TV-MA','Drama','5 Seasons','/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',96,9.5,97,'HhesaQXLuRY','breaking_bad','tt0903747'),
  s(109,'Game of Thrones',2019,'TV-MA','Drama','8 Seasons','/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',89,9.2,90,'bjqEWgDVPe0','game_of_thrones','tt0944947'),
  s(119,'Vikings',2020,'TV-MA','Drama','6 Seasons','/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg',93,8.5,88,'HXqz1DMXD-0','vikings','tt2306299'),
  s(120,'Better Call Saul',2022,'TV-MA','Drama','6 Seasons','/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',99,9.0,96,'HN4oydykJFc','better_call_saul','tt3032476'),
  s(117,'The Handmaid\'s Tale',2024,'TV-MA','Drama','5 Seasons','/eGUT7j3n3rn5yGihlCgwUnD70HV.jpg',83,8.4,82,'PJTonrzY_Ag','the_handmaids_tale','tt5834204'),

  // Thriller
  s(102,'Severance',2025,'TV-MA','Thriller','2 Seasons','/2JP6NSmBwxg75uTcIHiv5R8PpPi.jpg',97,8.5,95,'_UXKlYvLGJY','severance','tt11280740'),
  s(104,'Squid Game',2024,'TV-MA','Thriller','2 Seasons','/eiJeWeCAEZAmRppnXHiTWDcCd3Q.jpg',85,8.0,84,'lQBmZBJCYcY','squid_game','tt10919420'),
  s(110,'Yellowjackets',2025,'TV-MA','Thriller','3 Seasons','/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg',88,7.8,86,'x8FUUxj6yOA','yellowjackets','tt11041332'),
  s(111,'The Agency',2024,'TV-MA','Thriller','1 Season','/ltG0kMlDcy84AxYekX7Cqr0JCAT.jpg',72,6.8,70,'pAxMy31nffA','the_agency_2024','tt27995594'),
  s(121,'The Penguin',2024,'TV-MA','Thriller','1 Season','/6HanIV2hTLE2w7A5bI1KJb3bTL7.jpg',94,8.5,92,'P1k9dL1jFaw','the_penguin','tt15435876'),
  s(122,'Money Heist',2021,'TV-MA','Thriller','5 Seasons','/QWbPaDxiB6LW2LjASknzYBvjMj.jpg',83,8.2,81,'htOksuyEjMU','money_heist','tt6468322'),
  s(113,'Stranger Things',2025,'TV-14','Thriller','4 Seasons','/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',92,8.7,90,'b9EkMc79ZSU','stranger_things','tt4574334'),

  // Action
  s(106,'The Boys',2024,'TV-MA','Action','4 Seasons','/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',93,8.7,91,'EzFXDvC-EwM','the_boys','tt1190634'),
  s(114,'The Mandalorian',2023,'TV-PG','Action','3 Seasons','/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',89,8.7,88,'aOC8E8z_ifw','the_mandalorian','tt8111088'),
  s(118,'The Witcher',2023,'TV-MA','Action','3 Seasons','/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg',70,8.0,74,'ndl1W4ltcmg','the_witcher','tt5180504'),

  // Sci-Fi
  s(108,'The Rings of Power',2024,'TV-14','Sci-Fi','2 Seasons','/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg',76,6.9,72,'gUwboXm0t3U','the_lord_of_the_rings_the_rings_of_power','tt7631058'),
  s(116,'Foundation',2024,'TV-14','Sci-Fi','2 Seasons','/tg9I5pOY4M9CKj8U0cxVBTsm5eh.jpg',72,7.3,74,'X4QYV5GTz7c','foundation','tt0804484'),

  // Comedy
  s(112,'Lucifer',2021,'TV-14','Comedy','6 Seasons','/ekZobS8isE6mA53RAiGDG93hBxL.jpg',85,8.1,83,'ueMwVGBwqRo','lucifer','tt4052886'),
  s(115,'Rick and Morty',2024,'TV-MA','Comedy','7 Seasons','/WGRQ8FpjkDTzivQJ43t94bOuY0.jpg',93,9.1,92,'WJv87hxJJWE','rick_and_morty','tt2861424'),

  // Horror
  s(123,'The Walking Dead',2022,'TV-MA','Horror','11 Seasons','/s3OIDrCErUjthsnPPreY7XktQXB.jpg',80,8.1,78,'R1v0uFms68U','the_walking_dead','tt1520211'),

  // ── Additional Sci-Fi movies ──
  m(33,'The Martian',2015,'PG-13','Sci-Fi','2h 24m','/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg',91,8.0,88,'ej3ioOneTy8','the_martian','tt3659388'),
  m(34,'Arrival',2016,'PG-13','Sci-Fi','1h 56m','/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg',94,7.9,90,'tFMo3UJ4B4g','arrival_2016','tt2543164'),
  m(35,'Blade Runner 2049',2017,'R','Sci-Fi','2h 44m','/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',88,8.0,86,'gCcx85e7NY4','blade_runner_2049','tt1856101'),
  m(36,'The Matrix',1999,'R','Sci-Fi','2h 16m','/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg',83,8.7,88,'vKQi3bBA1y8','the_matrix','tt0133093'),
  m(37,'Avatar',2009,'PG-13','Sci-Fi','2h 42m','/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg',81,7.9,82,'5PSNL1qE6VY','avatar','tt0499549'),
  m(38,'Ex Machina',2014,'R','Sci-Fi','1h 48m','/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',92,7.7,89,'EoQaLg_wEEQ','ex_machina_2015','tt0470752'),
  m(39,'Tenet',2020,'PG-13','Sci-Fi','2h 30m','/aCIFMriQh8rvhxpN1IWGgvH0Tlg.jpg',69,7.3,72,'LdOM0x0XDMo','tenet','tt6723592'),
  m(40,'Everything Everywhere All at Once',2022,'R','Sci-Fi','2h 19m','/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',94,7.8,93,'wxN1T1qdQ_g','everything_everywhere_all_at_once','tt6710474'),
  m(41,'Nope',2022,'R','Sci-Fi','2h 10m','/AcKVlWaNVVVFQwro3nLXqPljcYA.jpg',83,6.8,80,'In8fuzj3gck','nope','tt10954984'),

  // ── Additional Comedy movies ──
  m(42,'Knives Out',2019,'PG-13','Comedy','2h 11m','/pThyQovXQrw2m0s9x82twj48Jq4.jpg',97,7.9,94,'qGqiHJTsRkQ','knives_out','tt8946378'),
  m(43,'Glass Onion',2022,'PG-13','Comedy','2h 19m','/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg',93,7.1,90,'wJOHKAy16LY','glass_onion_a_knives_out_mystery','tt11564570'),
  m(44,'The Grand Budapest Hotel',2014,'R','Comedy','1h 39m','/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',92,8.1,90,'1Fg5iWmQjwk','the_grand_budapest_hotel','tt2278388'),
  m(45,'Parasite',2019,'R','Comedy','2h 12m','/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',99,8.5,97,'5xH0HfJHsaY','parasite_2019','tt6751668'),
  m(46,'Get Out',2017,'R','Comedy','1h 44m','/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg',98,7.7,95,'DzfpyUB60YY','get_out','tt5052448'),
  m(47,'Gone Girl',2014,'R','Comedy','2h 29m','/ts996lKsxvjkO2yiYG0ht4qAicO.jpg',87,8.1,86,'2-_-1nJf8dg','gone_girl','tt2267998'),
  m(48,'The Menu',2022,'R','Comedy','1h 47m','/fPtUgMcLIboqlTlPrq0bQpKK8eq.jpg',88,7.2,85,'C_uTkUGcHv4','the_menu','tt9764362'),

  // ── Additional Horror movies ──
  m(49,'A Quiet Place',2018,'PG-13','Horror','1h 30m','/nAU74GmpUk7t5iklEp3bufwDq4n.jpg',96,7.5,90,'WR7cc5t7tv8','a_quiet_place','tt6644200'),
  m(50,'Hereditary',2018,'R','Horror','2h 7m','/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg',89,7.3,86,'V6wWKNij_1M','hereditary','tt7784604'),
  m(51,'Us',2019,'R','Horror','1h 56m','/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg',93,6.8,85,'hBvcngHRTFg','us_2019','tt6857112'),
  m(52,'Midsommar',2019,'R','Horror','2h 28m','/9bXHaLlsFYpJUutg4E6WXAjaxDi.jpg',83,7.1,80,'1Vnghdsjmd0','midsommar','tt8772262'),
  m(53,'Parasite',2019,'R','Horror','2h 12m','/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',99,8.5,97,'5xH0HfJHsaY','parasite_2019','tt6751668'),
  m(54,'Get Out',2017,'R','Horror','1h 44m','/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg',98,7.7,95,'DzfpyUB60YY','get_out','tt5052448'),
  m(55,'Gone Girl',2014,'R','Horror','2h 29m','/ts996lKsxvjkO2yiYG0ht4qAicO.jpg',87,8.1,86,'2-_-1nJf8dg','gone_girl','tt2267998'),
  m(56,'The Menu',2022,'R','Horror','1h 47m','/fPtUgMcLIboqlTlPrq0bQpKK8eq.jpg',88,7.2,85,'C_uTkUGcHv4','the_menu','tt9764362'),

  // ── Additional Action movie ──
  m(66,'Mission: Impossible - Dead Reckoning',2023,'PG-13','Action','2h 43m','/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',96,7.7,90,'avz06PDqDbM','mission_impossible_dead_reckoning_part_one','tt9603212'),

  // ── Additional Thriller movies ──
  m(67,'Shutter Island',2010,'R','Thriller','2h 18m','/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg',68,8.2,80,'5iaYLCiq5RM','shutter_island','tt1130884'),
  m(68,'Zodiac',2007,'R','Thriller','2h 37m','/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg',89,7.7,84,'yNncHPl1UEg','zodiac','tt0443706'),

  // ── Additional Drama movies ──
  m(57,'Top Gun: Maverick',2022,'PG-13','Drama','2h 11m','/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',96,8.2,94,'giXco2jaZ_4','top_gun_maverick','tt1745960'),
  m(58,'The Shawshank Redemption',1994,'R','Drama','2h 22m','/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',90,9.3,96,'NmzuHjWmXOc','the_shawshank_redemption','tt0111161'),
  m(59,'Marriage Story',2019,'R','Drama','2h 17m','/kDEjffiKgjuGo2DRzsqfjvW0CQh.jpg',95,7.9,91,'BHi-a1n8t7M','marriage_story','tt7653254'),
  m(60,'Past Lives',2023,'PG-13','Drama','1h 46m','/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',96,7.8,93,'kA244xewjcI','past_lives','tt13238346'),
  m(61,'Tár',2022,'R','Drama','2h 38m','/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg',91,7.4,88,'4Yq4M4bqFbU','tar_2022','tt14444726'),
  m(62,'Yellowstone (film)',2023,'R','Drama','2h 5m','/vOYfRZ0NpUK5hG2CB2dJFnYJlGe.jpg',75,6.8,73,'','yellowstone','tt0120815'),

  // ── Additional Animation movies ──
  m(63,'Spider-Verse',2018,'PG','Animation','1h 57m','/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',97,8.4,95,'g4Hbz2jLxvQ','spider_man_into_the_spider_verse','tt4633694'),
  m(64,'Coco',2017,'PG','Animation','1h 49m','/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg',97,8.4,95,'Rvr68u6k5sI','coco_2017','tt2380307'),

  // ── Additional Thriller movies ──
  m(65,'Interstellar',2014,'PG-13','Thriller','2h 49m','/7fR3KxswtY8OHHZuOUB9td58CRX.jpg',73,8.7,88,'zSWdZVtXT7E','interstellar_2014','tt0816692'),

  // ── Additional TV shows ──
  // Sci-Fi shows
  s(124,'Black Mirror',2023,'TV-MA','Sci-Fi','6 Seasons','/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg',83,8.7,85,'d3PSfJlm1UE','black_mirror','tt2085059'),
  s(125,'Silo',2024,'TV-14','Sci-Fi','2 Seasons','/EpDuYIK81YtCUT3gH2JDpyj8Qk.jpg',89,8.2,86,'8ZYhuvIv1pA','silo','tt14688458'),
  s(126,'The Expanse',2022,'TV-14','Sci-Fi','6 Seasons','/huxmY6Dmzwpv5Q2hnNft0UMK7vf.jpg',94,8.5,90,'kQuKREptgkI','the_expanse','tt3230854'),
  s(127,'Andor',2022,'TV-14','Sci-Fi','1 Season','/khZqmwHQicTYoS7Flreb9EddFZC.jpg',96,8.4,93,'cKOegEuCcfw','andor','tt9253284'),
  s(128,'Halo',2024,'TV-14','Sci-Fi','2 Seasons','/4UmNhZCEu8Vt3byMvNxNEPyf8EY.jpg',52,6.7,58,'cBfsJMWj76Q','halo','tt2934286'),
  s(129,'Ahsoka',2023,'TV-PG','Sci-Fi','1 Season','/gbSaK9v1CbcYH1ISgbM7XObD2dW.jpg',77,7.4,75,'J5JyFVFoEFo','ahsoka','tt13622776'),
  s(130,'Westworld',2022,'TV-MA','Sci-Fi','4 Seasons','/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg',74,8.5,78,'9MR-VpHaJVs','westworld','tt0475784'),

  // Comedy shows
  s(131,'Ted Lasso',2023,'TV-MA','Comedy','3 Seasons','/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg',89,8.8,90,'3u7EIiohs6U','ted_lasso','tt10986410'),
  s(132,'The Office',2013,'TV-14','Comedy','9 Seasons','/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',89,9.0,92,'LHOtME2DL4g','the_office','tt0386676'),
  s(133,'Parks and Recreation',2015,'TV-PG','Comedy','7 Seasons','/A3SymGlOHefSKbz1bCOz56moupS.jpg',93,8.6,90,'A1S5P7jqP-s','parks_and_recreation','tt1266020'),
  s(134,'What We Do in the Shadows',2024,'TV-MA','Comedy','6 Seasons','/wa3ZQE9kLnqwN3vQ0NNjg1NPsCa.jpg',94,8.6,91,'mfBbSwS1dEA','what_we_do_in_the_shadows','tt7908628'),
  s(135,'Disenchantment',2023,'TV-14','Comedy','5 Seasons','/1WynayCqKRzrl4cFZR8NOfiDwd6.jpg',68,7.2,70,'GhcGkc-bR5M','disenchantment','tt5363918'),
  s(136,'South Park',2024,'TV-MA','Comedy','26 Seasons','/1CGwZCFX2qerXaXQJJUB3qUvxq7.jpg',80,8.7,82,'A_Aas0eKfzI','south_park','tt0121955'),
  s(137,'Brooklyn Nine-Nine',2021,'TV-14','Comedy','8 Seasons','/A3SymGlOHefSKbz1bCOz56moupS.jpg',95,8.4,91,'sEOuJ4z5aTc','brooklyn_nine_nine','tt2467372'),

  // Action shows
  s(138,'Reacher',2024,'TV-MA','Action','2 Seasons','/pcT1vivabBnBk0tZgVBO1I8aK75.jpg',92,8.1,88,'GSycMQ47lno','reacher','tt9288030'),
  s(139,'Peacemaker',2022,'TV-MA','Action','1 Season','/kfcJl5e8CRWDU7e4vX6uNABPRbS.jpg',94,8.3,90,'WHXxVmeGQV8','peacemaker','tt13006836'),
  s(140,'The Umbrella Academy',2023,'TV-14','Action','4 Seasons','/kaMisKeOoTBPxPkbC3OW7Wgt6ON.jpg',77,7.9,78,'0DAmWHxeoKw','the_umbrella_academy','tt1312171'),
  s(141,'Invincible',2024,'TV-MA','Action','2 Seasons','/4tblBrslcKSifMVZ3TmtT2ukMor.jpg',98,8.7,95,'b1sE7yIEfNA','invincible','tt6741278'),
  s(142,'One Piece',2024,'TV-14','Action','1 Season','/dT10AxJIXVvRwFAew4tt2RhzJrD.jpg',85,8.4,83,'Ades3pQbeh8','one_piece_2023','tt11737520'),
  s(143,'The Witcher',2023,'TV-MA','Action','3 Seasons','/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg',70,8.0,74,'ndl1W4ltcmg','the_witcher','tt5180504'),

  // Horror shows
  s(144,'American Horror Story',2024,'TV-MA','Horror','12 Seasons','/fbKE87mojpIETWepSbD5Qt741fp.jpg',77,8.0,76,'vPG7FcVIBik','american_horror_story','tt1844624'),
  s(145,'The Haunting of Hill House',2018,'TV-MA','Horror','1 Season','/vb1sQLC2MqfCPOFqHd8SyVsyDVB.jpg',93,8.6,90,'LMMYOv3nqms','the_haunting_of_hill_house','tt6763664'),
  s(146,'From',2024,'TV-MA','Horror','3 Seasons','/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg',94,7.8,85,'pDHqAj4eJOg','from','tt9813792'),
  s(147,'All of Us Are Dead',2022,'TV-MA','Horror','1 Season','/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg',75,7.5,73,'IN5TD4VRcSM','all_of_us_are_dead','tt14169960'),
  s(148,'Stranger Things',2025,'TV-14','Horror','4 Seasons','/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',92,8.7,90,'b9EkMc79ZSU','stranger_things','tt4574334'),
  s(149,'Chernobyl',2019,'TV-MA','Horror','1 Season','/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',96,9.4,95,'s9APLXM9Ei8','chernobyl','tt7366338'),
  s(150,'The Midnight Club',2022,'TV-14','Horror','1 Season','/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg',72,6.6,68,'lBhyUxRzANY','the_midnight_club','tt13406334'),
  s(151,'Demon Slayer',2024,'TV-14','Horror','4 Seasons','/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',98,8.6,92,'VQGCKyvzIM4','demon_slayer','tt9335498'),
  s(152,'Arcane',2024,'TV-14','Horror','2 Seasons','/aVYHMW8pdzJ9qG1OGRMKyGy9xor.jpg',97,9.0,95,'fXmAurh012s','arcane','tt11126994'),

  // Animation shows
  s(153,'Invincible (Animated)',2024,'TV-MA','Animation','2 Seasons','/4tblBrslcKSifMVZ3TmtT2ukMor.jpg',98,8.7,95,'b1sE7yIEfNA','invincible','tt6741278'),
  s(154,'Arcane (Animated)',2024,'TV-14','Animation','2 Seasons','/aVYHMW8pdzJ9qG1OGRMKyGy9xor.jpg',97,9.0,95,'fXmAurh012s','arcane','tt11126994'),
  s(155,'Demon Slayer (Animated)',2024,'TV-14','Animation','4 Seasons','/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',98,8.6,92,'VQGCKyvzIM4','demon_slayer','tt9335498'),
  s(156,'Rick and Morty (Animated)',2024,'TV-MA','Animation','7 Seasons','/WGRQ8FpjkDTzivQJ43t94bOuY0.jpg',93,9.1,92,'WJv87hxJJWE','rick_and_morty','tt2861424'),
  s(157,'One Piece (Animated)',2024,'TV-14','Animation','1 Season','/dT10AxJIXVvRwFAew4tt2RhzJrD.jpg',85,8.4,83,'Ades3pQbeh8','one_piece_2023','tt11737520'),
  s(158,'Disenchantment (Animated)',2023,'TV-14','Animation','5 Seasons','/1WynayCqKRzrl4cFZR8NOfiDwd6.jpg',68,7.2,70,'GhcGkc-bR5M','disenchantment','tt5363918'),
  s(159,'South Park (Animated)',2024,'TV-MA','Animation','26 Seasons','/1CGwZCFX2qerXaXQJJUB3qUvxq7.jpg',80,8.7,82,'A_Aas0eKfzI','south_park','tt0121955'),
  s(160,'Love Death & Robots',2024,'TV-MA','Animation','3 Seasons','/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg',85,8.4,83,'wUFwunMKa4E','love_death_robots','tt9561862'),
  s(161,'The Mandalorian (Animated)',2023,'TV-PG','Animation','3 Seasons','/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',89,8.7,88,'aOC8E8z_ifw','the_mandalorian','tt8111088'),

  // Drama shows (need 1 more)
  s(162,'Yellowstone',2024,'TV-MA','Drama','5 Seasons','/vOYfRZ0NpUK5hG2CB2dJFnYJlGe.jpg',83,8.6,82,'HLxIaEhJEpY','yellowstone','tt4236770'),

  // Thriller shows (need 2 more)
  s(163,'You',2023,'TV-MA','Thriller','4 Seasons','/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',93,7.7,85,'4Df5VMp7sVs','you','tt7335184'),
  s(164,'Mindhunter',2019,'TV-MA','Thriller','2 Seasons','/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg',97,8.6,93,'oFlKiX4IfBw','mindhunter','tt5290382'),
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
