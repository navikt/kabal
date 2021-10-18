import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
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
        {bruker.info.sammensattNavn}
        <div>{bruker.valgtEnhetView.navn}</div>
      </StyledButton>
      <Dropdown open={isOpen} close={() => setIsOpen(false)} />
    </StyledContainer>
  );
};
