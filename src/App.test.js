import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sudoku title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sudoku Solver/i);
  expect(linkElement).toBeInTheDocument();
});
