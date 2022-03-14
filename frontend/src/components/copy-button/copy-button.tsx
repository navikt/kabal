import { Copy } from '@navikt/ds-icons';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  text?: string | null;
  title?: string;
  popoverOrientation?: PopoverOrientering;
  className?: string;
}

export const CopyButton = ({
  children,
  text,
  title = 'Klikk for å kopiere',
  popoverOrientation = PopoverOrientering.Under,
  className,
}: Props) => {
  const [popoverText, setPopoverText] = useState<string | null>(null);
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);

  if (text === null || typeof text === 'undefined' || text.length === 0) {
    return null;
  }

  return (
    <StyledCopyButton
      className={className}
      title={title}
      onClick={async () => {
        const copied = await copy(text);
        setPopoverText(copied ? 'Kopiert!' : 'Kunne ikke kopiere!');
      }}
      ref={setRef}
    >
      {children}
      <Icon />
      <Popover
        ankerEl={popoverText !== null ? ref ?? undefined : undefined}
        orientering={popoverOrientation}
        autoFokus={false}
        onRequestClose={() => setPopoverText(null)}
      >
        <StyledPopoverText>{popoverText}</StyledPopoverText>
      </Popover>
    </StyledCopyButton>
  );
};

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const StyledCopyButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  border: none;
  background: transparent;
  color: inherit;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const StyledPopoverText = styled.span`
  display: block;
  padding: 8px;
  color: #000;
`;

const Icon = styled(Copy)`
  flex-shrink: 0;
`;
