# Otter Challenge – Entwicklungsdokumentation

> Letzte Aktualisierung: Mai 2026

---

## 📱 Was ist diese App?

Eine **private PWA (Progressive Web App)** für die jährliche "Otter Challenge" – ein Freundeskreis-Event mit verschiedenen Disziplinen/Challenges. Die App zeigt Ranglisten, Feed-Fotos und Nutzerprofile. Sie läuft komplett im Browser ohne Server-Backend (alle Daten im Arbeitsspeicher via SQL.js).

---

## 🏗️ Tech-Stack

| Technologie | Version / Details |
|-------------|------------------|
| React | 18, TypeScript |
| Routing | react-router-dom v6 |
| Styling | styled-components + Theme |
| Datenbank | SQL.js (SQLite im Browser, in-memory) |
| Icons | react-icons (FontAwesome) |
| Build-Tool | CRACO (CRA mit Webpack-Overrides) |
| PWA | manifest.json, meta-tags, Inter-Font |

---

## 🚀 Entwicklung starten

```bash
npm start        # Dev-Server auf localhost:3000
npm run build    # Production-Build
```

> ⚠️ Die Datenbank ist **in-memory** (SQL.js). Beim Browser-Refresh werden alle Änderungen zurückgesetzt – die Seed-Daten aus `src/db/schema.ts` werden bei jedem Start neu geladen.

---

## 📁 Projektstruktur

```
src/
├── App.tsx                    # Routing + Provider-Baum
├── assets/
│   ├── avatarData.ts          # SVG-Fallback-Avatare als Base64-DataURLs
│   ├── avatars/               # Echte Avatar-Bilder (avatar1–6.jpg)
│   ├── photo1–6.jpg           # Echte Feed-Fotos
│   └── .gitkeep
├── components/
│   ├── Layout.tsx             # App-Shell mit Header + Navigation
│   ├── Navigation.tsx         # Bottom-Nav (mobile) / Top-Nav (desktop)
│   └── PrivateRoute.tsx       # Auth-Guard für geschützte Routen
├── context/
│   ├── AuthContext.tsx        # Login-State (currentUser, isAuthenticated)
│   └── ThemeContext.tsx       # Theme-Auswahl (sport/dark/amber/ocean)
├── db/
│   ├── DatabaseContext.tsx    # SQL.js Init + executeQuery()-Hook
│   └── schema.ts              # Tabellen-DDL + alle Seed-Daten ⭐
├── pages/
│   ├── Login.tsx              # Avatar-Grid + Passwort-Eingabe
│   ├── Feed.tsx               # Foto-Feed mit Likes & Kommentaren
│   ├── Championships.tsx      # Rangliste + Podium + Challenge-Details
│   ├── Profile.tsx            # Nutzerprofil mit Stats & Achievements
│   └── Settings.tsx           # Theme-Wahl, Info, Passwörter
├── styles/
│   ├── theme.ts               # Alle 4 Themes (Farben, Spacing, Shadows)
│   ├── globalStyles.ts        # CSS-Reset + globale Styles
│   └── styled.d.ts            # TypeScript-Typen für styled-components Theme
└── utils/
    └── assetUtils.ts          # getAvatarUrl(), getPhotoUrl(), getPhotoUrlWithFallback()
```

---

## 👥 Nutzer & Passwörter

| ID | Username | Passwort | Display Name | Avatar-Datei |
|----|----------|----------|--------------|--------------|
| 1 | russo | `fartblaster` | Russo | avatar1.jpg (echt) |
| 2 | stacho | `stinkbomb` | Stacho | avatar2.jpg (echt) |
| 3 | tim | `toottoot` | Tim | avatar3.jpg (echt) |
| 4 | lucas | `windbreaker` | Lucas | avatar4.jpg (echt) |
| 5 | paul | `gasattack` | Paul | avatar5.jpg (echt) |
| 6 | dennis | `organizer` | Dennis | avatar6.jpg (echt) |
| 7 | paddy | `paddyfart` | Paddy | avatar7.jpg (→ SVG-Fallback, kein echtes Foto) |

> **Paul** ist in Jahr 2 (2025) als **Organisator** tätig und erscheint deshalb nicht in der 2025-Rangliste. Er hat 0 Teilnahmen → wird durch `.filter(s => s.disciplines_participated > 0)` herausgefiltert.

---

## 🏆 Wettkampf-Daten (schema.ts)

### Competitions
| ID | Jahr | Sieger |
|----|------|--------|
| 1 | 2024 | Paul (15 Punkte) |
| 2 | 2025 | Lucas (40 Punkte) |

### Disciplines – Jahr 2024 (IDs 1–4)
| ID | Name |
|----|------|
| 1 | Geoguessr |
| 2 | Lieder raten ohne Lyrics |
| 3 | Baseball |
| 4 | Wakeboard |

> Russo hat beim Wakeboard nicht teilgenommen.

### Disciplines – Jahr 2025 (IDs 5–17)
| ID | Name | Besonderheit |
|----|------|--------------|
| 5 | Russo Einstieg | Nur Russo, 13 Basispunkte (er kam ab Spiel 5 dazu) |
| 6 | Biertasting | |
| 7 | Kilometerschätzen | |
| 8 | Vollpfosten | |
| 9 | Schnaps | |
| 10 | Wort gleich sagen | |
| 11 | Quiz | |
| 12 | Abschlag | |
| 13 | Fußball | |
| 14 | ?? | Name unbekannt/unlesbar |
| 15 | Wettessen | |
| 16 | Pong | |
| 17 | Kartenhaus | |

### Endstand 2025
| Platz | Name | Punkte |
|-------|------|--------|
| 1 | Lucas | 40 |
| 2 | Dennis | 35 |
| 3 | Tim | 29 |
| 3 | Paddy | 29 |
| 5 | Stacho | 26 |
| 6 | Russo | 25 (inkl. 13 Einstiegs-Punkte) |

---

## 🗄️ Datenbank-Schema (SQL)

```sql
users         (id, username, password, display_name, avatar)
competitions  (id, year, name, date)
disciplines   (id, competition_id, name)
results       (id, discipline_id, user_id, position, points)
photos        (id, url, description, date_taken, uploaded_by)
comments      (id, photo_id, user_id, content)
likes         (id, photo_id, user_id) -- UNIQUE(photo_id, user_id)
```

### Daten abfragen
```tsx
const { executeQuery } = useDatabase();

// Beispiel: alle User holen
const users = executeQuery('SELECT * FROM users') as User[];

// Beispiel: mit Parameter
const results = executeQuery(
  'SELECT * FROM results WHERE discipline_id = ?',
  [disciplineId]
);
```

> ⚠️ `executeQuery` gibt immer `any[]` zurück – bitte immer mit `as MyType[]` casten.

---

## 🎨 Theme-System

Definiert in `src/styles/theme.ts`. 4 Themes wählbar in Settings:

| Theme | Primärfarbe | Stil |
|-------|-------------|------|
| `sport` | `#FC4C02` (Strava-Orange) | Hell, sportlich – **Standard** |
| `dark` | `#FC4C02` | Dunkel |
| `amber` | `#F59E0B` | Warm/Gold |
| `ocean` | `#0EA5E9` | Blau |

Theme-Auswahl wird in `localStorage` unter `otter-theme` gespeichert.

### Wichtige Theme-Properties
```ts
theme.colors.primary        // Hauptfarbe
theme.colors.background     // Seitenhintergrund
theme.colors.card           // Karten-Hintergrund
theme.colors.text           // Haupttext
theme.colors.textMuted      // Sekundärtext (#888)
theme.colors.border         // Rahmenfarbe
theme.spacing.sm/md/lg/xl   // Abstände
theme.borderRadius.small/medium/large/pill
theme.shadows.small/card/medium
```

---

## 📸 Bilder / Assets

### Feed-Fotos
- Dateien: `src/assets/photo1.jpg` – `photo6.jpg`
- Referenzierung: In der DB über `url`-Feld (z.B. `'photo1.jpg'`)
- Laden: `getPhotoUrlWithFallback('photo1.jpg', 1)` aus `assetUtils.ts`
- Fallback: Farbiger SVG-Platzhalter wenn Datei fehlt

### Avatare
- Echte Fotos: `src/assets/avatars/avatar1.jpg` – `avatar6.jpg`
- Paddy (id=7): Kein echtes Foto → SVG-Buchstaben-Avatar aus `avatarData.ts`
- Laden: `getAvatarUrl('avatar1.jpg')` aus `assetUtils.ts`
- In DB gespeichert als Dateiname: `'avatar1.jpg'`, `'avatar7.jpg'` etc.

### Neuen User/Avatar hinzufügen
1. Avatar-Bild als `avatar8.jpg` in `src/assets/avatars/` ablegen
2. Import in `assetUtils.ts` hinzufügen + in `avatarImages`-Map eintragen
3. `avatarData.ts`: SVG-Fallback-Eintrag ergänzen (für den Fall ohne echtes Foto)
4. `schema.ts`: User-INSERT ergänzen
5. `context/AuthContext.tsx`: User-Liste prüfen (falls dort hardcoded)

---

## 🔐 Auth-System

- Kein JWT/Session – Login-State nur im React-State (`AuthContext`)
- `currentUser` enthält: `{ id, username, display_name, avatar, password }`
- Login prüft gegen SQL.js-Datenbank: `SELECT * FROM users WHERE username=? AND password=?`
- Bei Browser-Refresh: ausgeloggt (kein localStorage-Persist)
- Geschützte Routen via `<PrivateRoute />` → Redirect auf `/login`

---

## 📄 Seiten-Übersicht

### `/login`
- Avatar-Grid aller 7 User
- Klick auf Avatar → Passwort-Eingabefeld erscheint
- Shake-Animation bei falschem Passwort

### `/feed`
- Alle Fotos aus `photos`-Tabelle
- Like/Unlike (Toggle), Kommentare anzeigen
- Bild-Upload-Button ist sichtbar, aber **noch nicht implementiert**

### `/championships`
- Jahr-Selektor (2024, 2025, ...)
- Podium Top 3 (Reihenfolge: 2. – 1. – 3.)
- Gesamttabelle mit Progress-Bar
- Aufklappbare Challenge-Cards
- `'Russo Einstieg'` wird in der Challenge-Liste gefiltert (nicht angezeigt)

### `/profile`
- Zeigt Profil des aktuell eingeloggten Users
- Hero-Banner, Stats-Grid, Achievements
- `?user=<id>` Query-Parameter kann andere Profile anzeigen *(falls implementiert)*

### `/settings`
- Theme-Kacheln zum Tippen
- Passwort-Übersicht (alle User)
- About-Section mit App-Infos

---

## ⚠️ Bekannte Limitierungen / TODOs

- **Daten sind nicht persistent** – jeder Refresh setzt alles zurück (SQL.js ist in-memory). Für Persistenz: IndexedDB oder Backend nötig.
- **Foto-Upload** nicht implementiert (Button vorhanden, Logik fehlt)
- **avatar7.jpg (Paddy)** existiert noch nicht – nur SVG-Fallback
- **Challenge "??"** (Discipline 14, 2025) – Name unbekannt, bitte nachpflegen
- **Likes-System** ist session-basiert – nach Refresh zurückgesetzt
- Die Warnung `Can't resolve 'vm' in asn1.js` ist ein bekanntes Webpack-5-Problem eines Drittpakets und schadet der App nicht
- **Russo-Einstieg**: Die 13 Basispunkte sind als separate Discipline modelliert, damit der Gesamtstand stimmt. Diese Discipline wird in der UI bewusst ausgeblendet (`filter(d => d.name !== 'Russo Einstieg')`)

---

## 🔧 Häufige Aufgaben

### Neue Challenge/Discipline für ein Jahr hinzufügen
In `src/db/schema.ts`:
```sql
INSERT OR IGNORE INTO disciplines (id, competition_id, name) VALUES (18, 2, 'Neue Challenge');
INSERT OR IGNORE INTO results (discipline_id, user_id, position, points) VALUES
(18, 4, 1, 5), -- Lucas 1.
(18, 3, 2, 4), -- Tim   2.
...
```

### Neues Jahr/Competition hinzufügen
```sql
INSERT OR IGNORE INTO competitions (id, year, name, date) VALUES (3, 2026, 'Otter Challenge', '2026-06-15');
```

### Theme-Farbe ändern
`src/styles/theme.ts` → `themes['sport'].colors.primary`

### Neues Foto zum Feed hinzufügen
1. Bild als `photo7.jpg` in `src/assets/` ablegen
2. Import in `assetUtils.ts` ergänzen + in `photoMap` eintragen
3. In `schema.ts` SEED_PHOTOS INSERT ergänzen

---

## 📦 Wichtige Abhängigkeiten

```json
"sql.js"            : SQLite im Browser (WASM, lädt von sql.js.org/dist/)
"styled-components" : CSS-in-JS Styling
"react-router-dom"  : Routing
"react-icons"       : Icons (FontAwesome-Subset)
"@craco/craco"      : CRA-Webpack-Override (z.B. für WASM-Support)
```

---

## 🌐 PWA

- `public/manifest.json`: theme_color `#FC4C02`, display `standalone`, deutsch
- `public/index.html`: Inter-Font (Google Fonts), Splash-Screen-Meta, mobile viewport
- Kein Service Worker aktiv (kein Offline-Support)
