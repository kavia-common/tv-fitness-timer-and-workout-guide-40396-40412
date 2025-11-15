import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme'; // initialize feature flags (safe no-op in tests/SSR)
import App from './App';
import { FocusManagerProvider } from './components/FocusManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FocusManagerProvider>
      <App />
    </FocusManagerProvider>
  </React.StrictMode>
);
