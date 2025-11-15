import React, { useState, useEffect } from 'react';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import Header from './components/Header';

/**
 * PUBLIC_INTERFACE
 * App
 * Root of the Android TV Fitness Timer and Workout Guide UI.
 * Renders ScreenWrapper -> Header -> placeholder Row containers.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ScreenWrapper theme={theme}>
      <div className="App">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        {/* Hero/Intro Row */}
        <section
          className="px-container smooth-fade-in"
          aria-label="Featured Workouts"
          style={{ marginTop: 'var(--space-6)' }}
        >
          <div className="h1">Welcome back</div>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Pick a workout or browse exercises to get started.
          </div>

          <div
            role="list"
            className="row-enter row-enter-active"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            <div role="listitem" className="tv-card" style={{ padding: 'var(--space-6)' }}>
              <div className="h3">Quick HIIT</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>10 min • High intensity</div>
            </div>
            <div role="listitem" className="tv-card" style={{ padding: 'var(--space-6)' }}>
              <div className="h3">Core Starter</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>8 min • Beginner</div>
            </div>
            <div role="listitem" className="tv-card" style={{ padding: 'var(--space-6)' }}>
              <div className="h3">Full Body</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>20 min • Mixed</div>
            </div>
          </div>
        </section>

        {/* Exercises Row placeholder */}
        <section className="px-container" aria-label="Popular Exercises" style={{ marginTop: 'var(--space-12)' }}>
          <div className="h2" style={{ marginBottom: 'var(--space-6)' }}>
            Popular Exercises
          </div>
          <div
            role="list"
            className="row-enter row-enter-active"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {['Push-ups', 'Squats', 'Plank', 'Burpees', 'Lunges', 'Mountain Climbers'].map((name) => (
              <div key={name} role="listitem" className="tv-card" style={{ padding: 'var(--space-6)' }}>
                <div className="h3" style={{ marginBottom: 'var(--space-2)' }}>
                  {name}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>Beginner • Bodyweight</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ScreenWrapper>
  );
}

export default App;
