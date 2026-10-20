import { render, screen } from '@testing-library/react';
import App from './App';
import { celsiusToFahrenheit, formatTemperature } from './utils/conversions';

test('renders Weather Finder app title and search input', () => {
  render(<App />);
  const titleElement = screen.getByText(/Weather Finder/i);
  expect(titleElement).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText(/Search city/i);
  expect(searchInput).toBeInTheDocument();
});

test('converts temperatures accurately between Celsius and Fahrenheit', () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
  expect(celsiusToFahrenheit(25)).toBe(77);
  expect(celsiusToFahrenheit(100)).toBe(212);
  expect(formatTemperature(20, 'metric')).toBe('20°C');
  expect(formatTemperature(20, 'imperial')).toBe('68°F');
});
