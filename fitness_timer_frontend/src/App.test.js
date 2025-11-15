import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title and a section heading', () => {
  render(<App />);

  // App title/header text from Header component
  expect(screen.getByText(/Fitness TV/i)).toBeInTheDocument();

  // At least one exercise section heading from EXERCISE_SECTIONS
  // Using "Warm-up" as it exists in src/data/exercises.js
  expect(screen.getByRole('heading', { name: /Warm-up/i })).toBeInTheDocument();
});
