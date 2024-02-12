import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';

// Some basic tests to make sure everything is being rendered correctly

describe('App Component', () => {
  test('renders Propellor title', () => {
    render(<App />);
    const titleElement = screen.getByText('Propellor');
    expect(titleElement).toBeInTheDocument();
  });
});