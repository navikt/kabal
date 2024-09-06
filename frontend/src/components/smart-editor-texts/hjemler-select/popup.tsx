import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Popup = ({ isOpen, children }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return <StyledPopup>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 400px;
  max-width: 275px;
  scroll-margin-bottom: var(--a-spacing-4);
  z-index: 22;

  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-divider);
  box-shadow: var(--a-shadow-medium);
`;
