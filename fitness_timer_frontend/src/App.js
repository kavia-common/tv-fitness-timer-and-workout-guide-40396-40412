import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element (kept for compatibility)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ScreenWrapper theme={theme}>
      <div className="App">
        <header className="App-header smooth-fade-in">
          <button 
            className="theme-toggle focus-visible-outline" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <img src={logo} className="App-logo" alt="logo" />
          <p className="h2" style={{ marginTop: 'var(--space-6)' }}>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p className="h3" style={{ color: 'var(--color-text-secondary)' }}>
            Current theme: <strong>{theme}</strong>
          </p>
          <a
            className="App-link btn btn-surface"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </ScreenWrapper>
  );
}

export default App;
