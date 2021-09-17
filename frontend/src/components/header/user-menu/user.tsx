import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useGetBrukerQuery, useGetValgtEnhetQuery } from '../../../redux-api/bruker';
import { Dropdown } from './dropdown';
import { StyledContainer, StyledButton } from './styled-components';

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
        {bruker?.displayName}
        <DisplayEnhet brukerId={bruker.onPremisesSamAccountName} />
      </StyledButton>
      <Dropdown open={isOpen} brukerId={bruker.onPremisesSamAccountName} close={() => setIsOpen(false)} />
    </StyledContainer>
  );
};

interface DisplayEnhetProps {
  brukerId: string;
}

const DisplayEnhet: React.FC<DisplayEnhetProps> = ({ brukerId }) => {
  const { data } = useGetValgtEnhetQuery(brukerId);
  if (typeof data === 'undefined') {
    return <div>Laster...</div>;
  }
  return <div>{data.navn}</div>;
};
