# Running SafePath AI Locally

## Prerequisites
1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. Git

## Setup Steps

1. Clone the repository:
git clone https://github.com/Ansh5748/safepath-ai.git
cd safepath-ai

2. Install dependencies:
cd client
npm install

3. Create a .env file in the client directory:
cp .env.example .env


4. Update the .env file with your API keys:
- Get Firebase credentials from Firebase Console
- Get Google Maps API key from Google Cloud Console

5. Start the development server:
npm start


The app will open automatically in your default browser at `http://localhost:3000`

## Common Issues

1. If you see a blank page:
- Check browser console for errors
- Verify all environment variables are set
- Clear browser cache and reload

2. If maps don't load:
- Verify Google Maps API key is correct
- Check if billing is enabled on Google Cloud Console

3. If authentication fails:
- Verify Firebase configuration
- Enable Email/Password authentication in Firebase Console

## Development Tips

1. Use Chrome DevTools for debugging
2. Enable React Developer Tools extension
3. Use the Redux DevTools for state management debugging
4. Check the browser console for errors and warnings

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from create-react-app

## Project Structure
client/
├── public/ # Static files
├── src/ # Source code
│ ├── components/ # React components
│ ├── contexts/ # React contexts
│ ├── hooks/ # Custom hooks
│ ├── services/ # API services
│ └── utils/ # Helper functions
└── package.json # Project dependencies


## Accessing Features

1. Emergency Panel: Homepage
2. Safety Map: Click "Map" in navigation
3. Threat Detection: Automatically runs
4. Evidence Collection: Available during incidents
5. Settings: User menu in top-right

## Testing Accounts

For development, use these test accounts:
- User: test@example.com / password123
- Admin: admin@example.com / admin123

To run the app:
Open terminal
Navigate to project directory
Run these commands
cd client
npm install
npm start

The app will automatically open in your browser at http://localhost:3000.