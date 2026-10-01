'use client';
import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;

const StyledField = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ErrorMsg = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

export const Input = React.forwardRef(({ label, error, ...props }, ref) => (
  <InputWrapper>
    <StyledLabel>{label}</StyledLabel>
    <StyledField ref={ref} {...props} />
    {error && <ErrorMsg>{error}</ErrorMsg>}
  </InputWrapper>
));

Input.displayName = 'Input';