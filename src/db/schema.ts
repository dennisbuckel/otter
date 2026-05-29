// Database schema definitions

export const CREATE_TABLES = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disciplines table
CREATE TABLE IF NOT EXISTS disciplines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  competition_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discipline_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  description TEXT,
  date_taken TEXT,
  uploaded_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(photo_id, user_id)
);
`;

// ─── Users ────────────────────────────────────────────────────────────────────
// Jahr 1 (2024): russo, stacho, tim, lucas, paul (Sieger), dennis
// Jahr 2 (2025): russo, stacho, tim, lucas, dennis + NEU: paddy  (paul = Organisator)
export const SEED_USERS = `
INSERT OR IGNORE INTO users (id, username, password, display_name, avatar) VALUES
(1, 'russo',  'fartblaster', 'Russo',  'avatar1.jpg'),
(2, 'stacho', 'stinkbomb',   'Stacho', 'avatar2.jpg'),
(3, 'tim',    'toottoot',    'Tim',    'avatar3.jpg'),
(4, 'lucas',  'windbreaker', 'Lucas',  'avatar4.jpg'),
(5, 'paul',   'gasattack',   'Paul',   'avatar5.jpg'),
(6, 'dennis', 'organizer',   'Dennis', 'avatar6.jpg'),
(7, 'paddy',  'paddyfart',   'Paddy',  'avatar7.jpg');
`;

// ─── Competitions ──────────────────────────────────────────────────────────────
export const SEED_COMPETITION = `
INSERT OR IGNORE INTO competitions (id, year, name, date) VALUES
(1, 2024, 'Otter Challenge', '2024-06-15'),
(2, 2025, 'Otter Challenge', '2025-06-15');

-- ═══════════════════════════════════════════════════════════════════════════
-- JAHR 1 (2024) – Competition id=1
-- Disciplines: id 1–4
-- ═══════════════════════════════════════════════════════════════════════════
INSERT OR IGNORE INTO disciplines (id, competition_id, name) VALUES
(1, 1, 'Geoguessr'),
(2, 1, 'Lieder raten ohne Lyrics'),
(3, 1, 'Baseball'),
(4, 1, 'Wakeboard');

-- Geoguessr (disc 1)
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(1, 1, 1, 5), -- Russo    1.
(1, 4, 2, 4), -- Lucas    2.
(1, 3, 3, 3), -- Tim      3.
(1, 2, 4, 2), -- Stacho   4.
(1, 5, 5, 1); -- Paul     5.

-- Lieder raten ohne Lyrics (disc 2)
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(2, 1, 1, 5), -- Russo    1.
(2, 5, 2, 4), -- Paul     2.
(2, 2, 3, 3), -- Stacho   3.
(2, 4, 4, 2), -- Lucas    4.
(2, 3, 5, 1); -- Tim      5.

-- Baseball (disc 3)
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(3, 5, 1, 5), -- Paul     1.
(3, 4, 2, 4), -- Lucas    2.
(3, 3, 3, 3), -- Tim      3.
(3, 1, 4, 2), -- Russo    4.
(3, 2, 5, 1); -- Stacho   5.

-- Wakeboard (disc 4)  – Russo hat nicht teilgenommen
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(4, 5, 1, 5), -- Paul     1.
(4, 3, 2, 4), -- Tim      2.
(4, 2, 3, 3), -- Stacho   3.
(4, 4, 4, 2); -- Lucas    4.

-- ═══════════════════════════════════════════════════════════════════════════
-- JAHR 2 (2025) – Competition id=2
-- Disciplines: id 5–17
-- Russo kam erst ab Spiel 5 dazu → 13 Basispunkte als Einstieg
-- Paul ist Organisator → keine Teilnahme (wird automatisch gefiltert)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT OR IGNORE INTO disciplines (id, competition_id, name) VALUES
(5,  2, 'Russo Einstieg'),
(6,  2, 'Biertasting'),
(7,  2, 'Kilometerschätzen'),
(8,  2, 'Vollpfosten'),
(9,  2, 'Schnaps'),
(10, 2, 'Wort gleich sagen'),
(11, 2, 'Quiz'),
(12, 2, 'Abschlag'),
(13, 2, 'Fußball'),
(14, 2, '??'),
(15, 2, 'Wettessen'),
(16, 2, 'Pong'),
(17, 2, 'Kartenhaus');

-- Russo Einstieg (disc 5) – 13 Basispunkte
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(5, 1, 1, 13);

-- Biertasting (disc 6)  [Tim=5, Stacho=3, Lucas=3, Paddy=1, Dennis=1]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(6, 3, 1, 5),  -- Tim      1.
(6, 2, 2, 3),  -- Stacho   2. (Tie)
(6, 4, 2, 3),  -- Lucas    2. (Tie)
(6, 7, 4, 1),  -- Paddy    4. (Tie)
(6, 6, 4, 1);  -- Dennis   4. (Tie)

-- Kilometerschätzen (disc 7)  [Lucas=5, Stacho=4, Dennis=3, Tim=2, Paddy=1]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(7, 4, 1, 5),  -- Lucas    1.
(7, 2, 2, 4),  -- Stacho   2.
(7, 6, 3, 3),  -- Dennis   3.
(7, 3, 4, 2),  -- Tim      4.
(7, 7, 5, 1);  -- Paddy    5.

-- Vollpfosten (disc 8)  [Paddy=5, Stacho=4, Dennis=3, Lucas=2, Tim=1]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(8, 7, 1, 5),  -- Paddy    1.
(8, 2, 2, 4),  -- Stacho   2.
(8, 6, 3, 3),  -- Dennis   3.
(8, 4, 4, 2),  -- Lucas    4.
(8, 3, 5, 1);  -- Tim      5.

-- Schnaps (disc 9)  [Dennis=5, Tim=4, Lucas=3, Paddy=2, Stacho=1]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(9, 6, 1, 5),  -- Dennis   1.
(9, 3, 2, 4),  -- Tim      2.
(9, 4, 3, 3),  -- Lucas    3.
(9, 7, 4, 2),  -- Paddy    4.
(9, 2, 5, 1);  -- Stacho   5.

-- Wort gleich sagen (disc 10)  [Paddy=5, Dennis=4, Stacho=3, Lucas=3, Tim=2, Russo=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(10, 7, 1, 5),  -- Paddy    1.
(10, 6, 2, 4),  -- Dennis   2.
(10, 2, 3, 3),  -- Stacho   3. (Tie)
(10, 4, 3, 3),  -- Lucas    3. (Tie)
(10, 3, 5, 2),  -- Tim      5.
(10, 1, 6, 0);  -- Russo    6.

-- Quiz (disc 11)  [Russo=5, Lucas=4, Paddy=3, Dennis=2, Tim=1, Stacho=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(11, 1, 1, 5),  -- Russo    1.
(11, 4, 2, 4),  -- Lucas    2.
(11, 7, 3, 3),  -- Paddy    3.
(11, 6, 4, 2),  -- Dennis   4.
(11, 3, 5, 1),  -- Tim      5.
(11, 2, 6, 0);  -- Stacho   6.

-- Abschlag (disc 12)  [Lucas=5, Paddy=4, Dennis=4, Stacho=2, Tim=1, Russo=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(12, 4, 1, 5),  -- Lucas    1.
(12, 7, 2, 4),  -- Paddy    2. (Tie)
(12, 6, 2, 4),  -- Dennis   2. (Tie)
(12, 2, 4, 2),  -- Stacho   4.
(12, 3, 5, 1),  -- Tim      5.
(12, 1, 6, 0);  -- Russo    6.

-- Fußball (disc 13)  [Tim=5, Dennis=4, Paddy=3, Lucas=2, Stacho=1, Russo=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(13, 3, 1, 5),  -- Tim      1.
(13, 6, 2, 4),  -- Dennis   2.
(13, 7, 3, 3),  -- Paddy    3.
(13, 4, 4, 2),  -- Lucas    4.
(13, 2, 5, 1),  -- Stacho   5.
(13, 1, 6, 0);  -- Russo    6.

-- ?? (disc 14)  [Paddy=1, Tim=1, Dennis=1, Stacho=0, Lucas=0, Russo=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(14, 7, 1, 1), -- Paddy    1. (Tie)
(14, 3, 1, 1), -- Tim      1. (Tie)
(14, 6, 1, 1), -- Dennis   1. (Tie)
(14, 2, 4, 0), -- Stacho   4. (Tie)
(14, 4, 4, 0), -- Lucas    4. (Tie)
(14, 1, 4, 0); -- Russo    4. (Tie)

-- Wettessen (disc 15)  [Dennis=5, Lucas=4, Stacho=3, Russo=3, Paddy=2, Tim=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(15, 6, 1, 5), -- Dennis   1.
(15, 4, 2, 4), -- Lucas    2.
(15, 2, 3, 3), -- Stacho   3. (Tie)
(15, 1, 3, 3), -- Russo    3. (Tie)
(15, 7, 5, 2), -- Paddy    5.
(15, 3, 6, 0); -- Tim      6.

-- Pong (disc 16)  [Lucas=5, Russo=4, Stacho=3, Tim=2, Paddy=1, Dennis=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(16, 4, 1, 5), -- Lucas    1.
(16, 1, 2, 4), -- Russo    2.
(16, 2, 3, 3), -- Stacho   3.
(16, 3, 4, 2), -- Tim      4.
(16, 7, 5, 1), -- Paddy    5.
(16, 6, 6, 0); -- Dennis   6.

-- Kartenhaus (disc 17)  [Tim=5, Lucas=4, Dennis=3, Stacho=2, Paddy=1, Russo=0]
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(17, 3, 1, 5), -- Tim      1.
(17, 4, 2, 4), -- Lucas    2.
(17, 6, 3, 3), -- Dennis   3.
(17, 2, 4, 2), -- Stacho   4.
(17, 7, 5, 1), -- Paddy    5.
(17, 1, 6, 0); -- Russo    6.
`;

// ─── Photos ────────────────────────────────────────────────────────────────────
export const SEED_PHOTOS = `
INSERT OR IGNORE INTO photos (url, description, date_taken, uploaded_by) VALUES
('photo1.jpg', 'Group photo from Otter Challenge',        '2024-06-10', 1),
('photo2.jpg', 'Beach day with the crew',                  '2024-07-22', 2),
('photo3.jpg', 'Hiking trip',                              '2024-08-15', 3),
('photo4.jpg', 'Game night',                               '2024-09-05', 4),
('photo5.jpg', 'Holiday party',                            '2024-12-20', 5),
('photo6.jpg', 'Planning the next Otter Challenge',        '2025-01-15', 6);

INSERT OR IGNORE INTO comments (photo_id, user_id, content) VALUES
(1, 2, 'Great day!'),
(1, 3, 'We should do this again soon!'),
(2, 1, 'The beach was amazing'),
(3, 4, 'That hike was tough!'),
(4, 5, 'I won that game!'),
(5, 1, 'Best party ever!'),
(6, 1, 'Looking forward to the next challenge!'),
(6, 2, 'Thanks for organizing, Dennis!');

INSERT OR IGNORE INTO likes (photo_id, user_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),
(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),
(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),
(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),
(6,1),(6,2),(6,3),(6,4),(6,5),(6,6);
`;
