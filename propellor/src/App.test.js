import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { getKeyWithLargestValue, getReplacementFrequency} from './utils';

describe('App Component', () => {
  test('renders Propellor title', () => {
    render(<App />);
    const titleElement = screen.getByText('Propellor');
    expect(titleElement).toBeInTheDocument();
  });

  test('Replacement Frequency', () => {
    const sampleRH = [{original: 'Elliot', new: 'Elliottt'}, {original: 'hi', new: 'Hi'}, {original: 'hi', new: 'Hello'}, {original: 'hi', new: 'Hi'}];
    const rf = getReplacementFrequency("hi", sampleRH);

    expect(rf['Hi']).toBe(2);
    expect(rf['Hello']).toBe(1);
    expect("Elliottt" in rf).toBe(false);
  });

  test("keyWithLargestValue", () => {
    const sampleRH = [{original: 'Elliot', new: 'Elliottt'}, {original: 'hi', new: 'Hi'}, {original: 'hi', new: 'Hello'}, {original: 'hi', new: 'Hi'}];
    const rf = getReplacementFrequency("hi", sampleRH);
    const key = getKeyWithLargestValue(rf);

    expect(key).toBe("Hi");
  });

  test("keyWithLargestValue no keys", () => {
    const key = getKeyWithLargestValue({});

    expect(key).toBe(null);
  });
});