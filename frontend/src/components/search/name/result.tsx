import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { getFullName } from '../../../domain/name';
import { formatPersonNum } from '../../../functions/format-id';
import { ArrowDown } from '../../../icons/arrow-down';
import { ArrowUp } from '../../../icons/arrow-up';
import { ISearchPerson } from '../../../types/oppgaver';
import { StyledFnr, StyledName, StyledResult } from '../common/styled-components';
import { Oppgaver } from './oppgaver';

export const Result = ({ fnr, navn }: ISearchPerson) => {
  const [open, setOpen] = useState<boolean>(false);

  const chevron = open ? <ArrowUp /> : <ArrowDown />;

  return (
    <StyledResult data-testid="search-result">
      <StyledName>{getFullName(navn)}</StyledName>
      <StyledFnr>{formatPersonNum(fnr)}</StyledFnr>
      <Knapp type="flat" mini onClick={() => setOpen(!open)} data-testid="search-result-expand-button">
        <span>{getOpenText(open)}</span>
        {chevron}
      </Knapp>
      <Oppgaver open={open} fnr={fnr} />
    </StyledResult>
  );
};

const getOpenText = (open: boolean) => (open ? 'Skjul saker' : 'Se saker');
