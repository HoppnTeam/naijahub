import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker } from "./lib/pwa-utils";

// Register service worker for PWA functionality
if (import.meta.env.PROD) {
  registerServiceWorker()
    .then((registration) => {
      console.log('Service worker registered successfully');
      
      // Set up update handling if needed
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                console.log('New content is available; please refresh.');
                // You could show a notification here
              }
            });
          }
        });
      }
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
