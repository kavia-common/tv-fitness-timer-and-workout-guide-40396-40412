import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import Header from './components/Header';
import TVFocusable from './components/TVFocusable';
import Row from './components/Row';
import { EXERCISE_SECTIONS } from './data/exercises';
import WorkoutTimer from './components/WorkoutTimer';
import ExerciseModal from './components/ExerciseModal';

/**
 * PUBLIC_INTERFACE
 * App
 * Root of the Android TV Fitness Timer and Workout Guide UI.
 * Renders ScreenWrapper -> Header -> Rows of exercises.
 * Includes focus-ready layout that integrates with FocusManager key routing.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Modal state
  const [selectedExercise, setSelectedExercise] = useState(null);
  const lastFocusedRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // When opening modal, capture active element to restore later
  const openExercise = (exercise, event) => {
    try {
      lastFocusedRef.current = document.activeElement;
    } catch {
      lastFocusedRef.current = null;
    }
    setSelectedExercise(exercise);
  };

  const closeExercise = () => {
    setSelectedExercise(null);
    // Restore focus to previously focused card if available
    const el = lastFocusedRef.current;
    if (el && typeof el.focus === 'function') {
      setTimeout(() => {
        try {
          el.focus();
        } catch {
          // ignore
        }
      }, 0);
    }
  };

  return (
    <ScreenWrapper theme={theme}>
      <div className="App">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        {/* Hero/Intro Row */}
        <section
          className="px-container smooth-fade-in"
          aria-label="Featured Workouts"
          style={{ marginTop: 'var(--space-8)' }}
        >
          <div className="h1">Welcome back</div>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
            Pick a workout or browse exercises to get started.
          </div>

          {/* Quick access demo timer */}
          <div
            className="row-enter row-enter-active"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(296px, 1fr) minmax(296px, 1fr) minmax(296px, 1fr)',
              gap: 'var(--space-6)',
            }}
          >
            <div className="tv-card" style={{ padding: 'var(--space-6)' }}>
              <div className="h3" style={{ marginBottom: 'var(--space-4)' }}>Quick Timer</div>
              <WorkoutTimer seconds={60} title="1-Minute Timer" />
            </div>

            <TVFocusable
              id="hero-quick-hiit"
              role="button"
              ariaLabel="Start Quick HIIT, 10 minutes, High intensity"
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
              role="button"
              ariaLabel="Start Core Starter, 8 minutes, Beginner"
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
            onSelectItem={(item, e) => {
              openExercise(
                section.items.find((x) => x.id === item.id) || {
                  id: item.id,
                  name: item.name,
                  description: '',
                  durationDefault: parseInt((item.subtitle || '60s').split('s')[0], 10) || 60,
                  difficulty: (item.subtitle || '').split('•')[1]?.trim() || 'Beginner',
                },
                e
              );
            }}
          />
        ))}

        {/* Modal */}
        {selectedExercise ? (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={closeExercise}
            initialFocusId="exercise-close"
          />
        ) : null}
      </div>
    </ScreenWrapper>
  );
}

export default App;
