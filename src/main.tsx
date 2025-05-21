import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { validateEnv } from '@/config/env';
import './styles/error.css';

// Validate environment variables
if (!validateEnv()) {
  // Display a more user-friendly error in production
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h1>Configuration Error</h1>
        <p>The application is missing required configuration. Please contact support.</p>
      </div>
    `;
  }
} else {
  // Render the app normally
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
