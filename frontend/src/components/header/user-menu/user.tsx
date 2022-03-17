import { Collapse, Expand, People } from '@navikt/ds-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import { useGetMySignatureQuery } from '../../../redux-api/bruker';
import { Dropdown } from './dropdown';

export const User = () => {
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useOnClickOutside(() => setIsOpen(false), ref);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (signatureIsLoading || typeof signature === 'undefined') {
    return <StyledContainer>Laster...</StyledContainer>;
  }

  const Arrow = isOpen ? Collapse : Expand;

  return (
    <StyledContainer ref={ref}>
      <StyledButton onClick={() => setIsOpen(!isOpen)} data-testid="user-menu-button">
        <People />
        {signature.customLongName ?? signature.longName}
        <Arrow />
      </StyledButton>
      <Dropdown open={isOpen} />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  position: relative;
  height: 100%;
  color: #fff;
`;

const iconText = css`
  & {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const StyledButton = styled.button`
  ${iconText}
  border: none;
  padding: 0;
  padding-right: 16px;
  margin: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  height: 100%;
`;
