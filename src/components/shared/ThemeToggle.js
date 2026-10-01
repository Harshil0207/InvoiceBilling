'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToggleButton = styled.button`
  background: var(--muted);
  border: 1px solid var(--border);
  color: var(--foreground);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: var(--border);
  }
`;

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle structural interface theme">
      {theme === 'light' ? (
        <>
          <span>🌙</span> Dark Mode
        </>
      ) : (
        <>
          <span>☀️</span> Light Mode
        </>
      )}
    </ToggleButton>
  );
}