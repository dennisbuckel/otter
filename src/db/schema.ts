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

// Initial seed data for the 6 users
export const SEED_USERS = `
INSERT OR IGNORE INTO users (id, username, password, display_name, avatar) VALUES
(1, 'russo', 'fartblaster', 'Russo', 'avatar1.jpg'),
(2, 'stacho', 'stinkbomb', 'Stacho', 'avatar2.jpg'),
(3, 'tim', 'toottoot', 'Tim', 'avatar3.jpg'),
(4, 'lucas', 'windbreaker', 'Lucas', 'avatar4.jpg'),
(5, 'paul', 'gasattack', 'Paul', 'avatar5.jpg'),
(6, 'dennis', 'organizer', 'Dennis', 'avatar6.jpg');
`;

// Real competition data for Otter Challenge
export const SEED_COMPETITION = `
-- Insert the Otter Challenge competition
INSERT OR IGNORE INTO competitions (id, year, name, date) VALUES
(1, 2025, 'Otter Challenge', '2025-06-15');

-- Insert the disciplines
INSERT OR IGNORE INTO disciplines (competition_id, name) VALUES
(1, 'Geoguessr'),
(1, 'Lieder raten ohne Lyrics'),
(1, 'Baseball'),
(1, 'Wakeboard');

-- Insert the results
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
-- Geoguessr results
(1, 1, 1, 5), -- Russo got 1st place (5 points)
(1, 4, 2, 4), -- Lucas got 2nd place (4 points)
(1, 3, 3, 3), -- Tim got 3rd place (3 points)
(1, 2, 4, 2), -- Stacho got 4th place (2 points)
(1, 5, 5, 1), -- Paul got 5th place (1 point)

-- Lieder raten ohne Lyrics results
(2, 1, 1, 5), -- Russo got 1st place (5 points)
(2, 5, 2, 4), -- Paul got 2nd place (4 points)
(2, 2, 3, 3), -- Stacho got 3rd place (3 points)
(2, 4, 4, 2), -- Lucas got 4th place (2 points)
(2, 3, 5, 1), -- Tim got 5th place (1 point)

-- Baseball results
(3, 5, 1, 5), -- Paul got 1st place (5 points)
(3, 4, 2, 4), -- Lucas got 2nd place (4 points)
(3, 3, 3, 3), -- Tim got 3rd place (3 points)
(3, 1, 4, 2), -- Russo got 4th place (2 points)
(3, 2, 5, 1), -- Stacho got 5th place (1 point)

-- Wakeboard results
(4, 5, 1, 5), -- Paul got 1st place (5 points)
(4, 3, 2, 4), -- Tim got 2nd place (4 points)
(4, 2, 3, 3), -- Stacho got 3rd place (3 points)
(4, 4, 4, 2); -- Lucas got 4th place (2 points)
-- Russo did not participate in Wakeboard
`;

// Sample photos data
export const SEED_PHOTOS = `
-- Insert some sample photos
INSERT OR IGNORE INTO photos (url, description, date_taken, uploaded_by) VALUES
('photo1.jpg', 'Group photo from Otter Challenge', '2024-06-10', 1),
('photo2.jpg', 'Beach day with the crew', '2024-07-22', 2),
('photo3.jpg', 'Hiking trip', '2024-08-15', 3),
('photo4.jpg', 'Game night', '2024-09-05', 4),
('photo5.jpg', 'Holiday party', '2024-12-20', 5),
('photo6.jpg', 'Planning the next Otter Challenge', '2025-01-15', 6);

-- Insert some sample comments
INSERT OR IGNORE INTO comments (photo_id, user_id, content) VALUES
(1, 2, 'Great day!'),
(1, 3, 'We should do this again soon!'),
(2, 1, 'The beach was amazing'),
(3, 4, 'That hike was tough!'),
(4, 5, 'I won that game!'),
(5, 1, 'Best party ever!'),
(6, 1, 'Looking forward to the next challenge!'),
(6, 2, 'Thanks for organizing, Dennis!');

-- Insert many likes (utopically high and different)
INSERT OR IGNORE INTO likes (photo_id, user_id) VALUES
-- Photo 1 (Group photo from Otter Challenge) - Very popular (142 likes)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- All users like this
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- Duplicated to simulate many likes
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),

-- Photo 2 (Beach day with the crew) - Moderately popular (78 likes)
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),

-- Photo 3 (Hiking trip) - Less popular (36 likes)
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),

-- Photo 4 (Game night) - Popular (96 likes)
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),

-- Photo 5 (Holiday party) - Moderately popular (54 likes)
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),

-- Photo 6 (Planning the next Otter Challenge) - Most popular (180 likes)
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6);
`;
