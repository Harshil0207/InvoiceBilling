'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// Slide-in animation for alert banners
const slideIn = keyframes`
  from {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
  max-width: 420px;
  width: calc(100% - 4rem);
`;

const ToastCard = styled.div`
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-left: 4px solid ${props => 
    props.$variant === 'success' ? '#10b981' : 
    props.$variant === 'danger' ? '#ef4444' : 'var(--primary)'};
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  animation: ${slideIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const MessageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  line-height: 1.25;
`;

const DismissButton = styled.button`
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
  line-height: 1;
  
  &:hover {
    color: var(--foreground);
  }
`;

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Date.now().toString();
    
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <ToastCard key={t.id} $variant={t.variant}>
            <MessageBlock>
              {t.title && <Title>{t.title}</Title>}
              {t.description && <Description>{t.description}</Description>}
            </MessageBlock>
            <DismissButton onClick={() => dismiss(t.id)}>×</DismissButton>
          </ToastCard>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be structural within a ToastProvider tree layout');
  }
  return context;
}