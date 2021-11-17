import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { getFullName } from '../../../domain/name';
import { Name } from '../../../domain/types';
import { ArrowDown } from '../../../icons/arrow-down';
import { ArrowUp } from '../../../icons/arrow-up';
import { StyledFnr, StyledName, StyledResult } from '../common/styled-components';
import { Oppgaver } from './oppgaver';

interface Props {
  fnr: string;
  navn: Name;
}

export const Result = ({ fnr, navn }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const chevron = open ? <ArrowUp /> : <ArrowDown />;

  return (
    <StyledResult data-testid="search-result">
      <StyledName>{getFullName(navn)}</StyledName>
      <StyledFnr>{fnr}</StyledFnr>
      <Knapp type="flat" mini onClick={() => setOpen(!open)} data-testid="search-result-expand-button">
        <span>{getOpenText(open)}</span>
        {chevron}
      </Knapp>
      <Oppgaver open={open} fnr={fnr} />
    </StyledResult>
  );
};

const getOpenText = (open: boolean) => (open ? 'Skjul saker' : 'Se saker');
