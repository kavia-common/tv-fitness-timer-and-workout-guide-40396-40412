import React, { useState, useEffect } from 'react';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import Header from './components/Header';
import TVFocusable from './components/TVFocusable';
import Row from './components/Row';
import { EXERCISE_SECTIONS } from './data/exercises';
import WorkoutTimer from './components/WorkoutTimer';

/**
 * PUBLIC_INTERFACE
 * App
 * Root of the Android TV Fitness Timer and Workout Guide UI.
 * Renders ScreenWrapper -> Header -> Rows of exercises.
 * Includes focus-ready layout that integrates with FocusManager key routing.
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

          {/* Quick access demo timer */}
          <div
            className="row-enter row-enter-active"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr) minmax(280px, 1fr)',
              gap: 'var(--space-6)',
            }}
          >
            <div className="tv-card" style={{ padding: 'var(--space-6)' }}>
              <div className="h3" style={{ marginBottom: 'var(--space-4)' }}>Quick Timer</div>
              <WorkoutTimer seconds={60} title="1-Minute Timer" />
            </div>

            <TVFocusable
              id="hero-quick-hiit"
              role="listitem"
              className="tv-card"
              style={{ padding: 'var(--space-6)' }}
              tabIndex={0}
              onSelect={() => {
                /* hook to start Quick HIIT */
              }}
            >
              <div className="h3">Quick HIIT</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>10 min • High intensity</div>
            </TVFocusable>

            <TVFocusable
              id="hero-core-starter"
              role="listitem"
              className="tv-card"
              style={{ padding: 'var(--space-6)' }}
              tabIndex={0}
              onSelect={() => {
                /* hook to start Core Starter */
              }}
            >
              <div className="h3">Core Starter</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>8 min • Beginner</div>
            </TVFocusable>
          </div>
        </section>

        {/* Data-driven Rows */}
        {EXERCISE_SECTIONS.map((section) => (
          <Row
            key={section.id}
            id={`row-${section.id}`}
            title={section.title}
            items={section.items.map((it) => ({
              id: it.id,
              name: it.name,
              subtitle: `${it.durationDefault}s • ${it.difficulty}`,
              thumbnail: it.thumbnail,
            }))}
            onSelectItem={(item) => {
              // TODO: integrate with timer/details view
              // eslint-disable-next-line no-console
              console.log('Selected item:', item);
            }}
          />
        ))}
      </div>
    </ScreenWrapper>
  );
}

export default App;
