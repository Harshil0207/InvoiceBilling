'use client';
import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  border: none;
  transition: background 0.15s ease;
  gap: 0.5rem;

  background: ${props => props.variant === 'danger' ? '#ef4444' : props.variant === 'secondary' ? 'var(--muted)' : 'var(--primary)'};
  color: ${props => props.variant === 'secondary' ? 'var(--foreground)' : '#ffffff'};

  &:hover {
    filter: brightness(0.9);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;