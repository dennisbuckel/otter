# OTTER Social Network

OTTER is a private social network application designed for a group of 6 friends to track their championship stats and share memories through photos.

## Features

### User System
- Simple login for 6 predefined users
- User profiles with avatars and basic info
- No registration needed (pre-populated)

### Championship System
- Flexible discipline setup (1-20 disciplines)
- Point allocation (5 for 1st, 4 for 2nd, etc.)
- Annual and all-time standings
- Data visualization for standings
- CRUD operations for competition results

### Photo Feed
- Pre-populated photo gallery
- Random display of past memories
- Like and comment functionality
- Chronological or random sorting options

### UI/UX
- Playful, modern design
- Dark/light mode + fun theme options
- Mobile-optimized interface
- Smooth animations and transitions

## Tech Stack

- **React** with **React Router** for navigation
- **SQL.js** for local database
- **Styled Components** for styling
- **TypeScript** for type safety
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/otter-social-network.git
cd otter-social-network
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Login Credentials

The application comes with 6 predefined users:

| Username | Password     | Display Name | Role                  |
|----------|--------------|--------------|----------------------|
| russo    | fartblaster  | Russo        | Participant          |
| stacho   | stinkbomb    | Stacho       | Participant          |
| tim      | toottoot     | Tim          | Participant          |
| lucas    | windbreaker  | Lucas        | Participant          |
| paul     | gasattack    | Paul         | Participant          |
| dennis   | organizer    | Dennis       | Organizer            |

## Avatar Generation

The application includes an avatar generator tool. To generate avatars:

1. Open `avatar-generator.html` in a web browser
2. Click the "Download" button under each avatar
3. Save the images as "avatar1.jpg", "avatar2.jpg", etc. in the src/assets folder

## Database

The application uses SQL.js, an in-memory SQL database that runs in the browser. The database schema includes tables for:

- Users
- Competitions
- Disciplines
- Results
- Photos
- Comments
- Likes

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
