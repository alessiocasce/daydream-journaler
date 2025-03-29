
# Daydream Journal Application

This is a full-stack journal application with a React frontend and Node.js/Express backend.

## Project Structure

- `/src` - Frontend React application
- `/server` - Backend Express application

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```
cd server
```

2. Install dependencies:
```
npm install
```

3. Make sure your MySQL server is running and you have created a database named `sito`.

4. Start the backend server:
```
npm run dev
```

The server will run on port 5000 and automatically create the necessary database tables.

### Frontend Setup

1. From the project root, install frontend dependencies:
```
npm install
```

2. Start the frontend development server:
```
npm run dev
```

The frontend will run on the default Vite port (typically 5173).

## Using the Application

1. Register a new account or use the default credentials:
   - Username: demo
   - Password: password123

2. Create journal entries for different days
3. Add goals and achievements
4. Set default achievements that will appear on new days

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Journal

- `GET /api/journal/entries` - Get all journal entries for the logged-in user
- `POST /api/journal/entries` - Save or update a journal entry
- `POST /api/journal/default-achievements` - Save default achievements

## Database Schema

The application uses the following MySQL tables:

- `users` - Store user accounts
- `journal_entries` - Store journal entries for each user and date
- `goals` - Store goals for each journal entry
- `achievements` - Store achievements for each journal entry
- `default_achievements` - Store default achievements for each user

## Troubleshooting

If you encounter issues connecting to the database:

1. Make sure your MySQL server is running
2. Verify the database credentials in `server/config/db.js`
3. Check that the `sito` database exists
