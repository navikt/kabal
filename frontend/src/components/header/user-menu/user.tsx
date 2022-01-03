import { People } from '@navikt/ds-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import { ArrowDown } from '../../../icons/arrow-down';
import { ArrowUp } from '../../../icons/arrow-up';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { Dropdown } from './dropdown';
import { StyledButton, StyledContainer } from './styled-components';

export const User = () => {
  const { data: bruker } = useGetBrukerQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useOnClickOutside(() => setIsOpen(false), ref);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (typeof bruker === 'undefined') {
    return <StyledContainer>Laster...</StyledContainer>;
  }

  return (
    <StyledContainer ref={ref}>
      <StyledButton onClick={() => setIsOpen(!isOpen)}>
        <People />
        <ButtonText>{bruker.info.sammensattNavn}</ButtonText>
        <Arrow isOpen={isOpen} />
      </StyledButton>
      <Dropdown open={isOpen} />
    </StyledContainer>
  );
};

const ButtonText = styled.span`
  margin-left: 8px;
  margin-right: 8px;
`;

const Arrow = ({ isOpen }: { isOpen: boolean }) => (isOpen ? <ArrowUp fill="white" /> : <ArrowDown fill="white" />);
