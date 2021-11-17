import React from 'react';
import { getFullName } from '../../../domain/name';
import { IFnrSearchResponse } from '../../../redux-api/oppgaver';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledOppgaverContainer } from '../common/oppgaver-container';
import { StyledFnr, StyledName, StyledResult } from '../common/styled-components';

export const Result = ({ fnr, navn, aapneKlagebehandlinger, avsluttedeKlagebehandlinger }: IFnrSearchResponse) => (
  <StyledResult key={fnr} data-testid="search-result">
    <StyledName>{getFullName(navn)}</StyledName>
    <StyledFnr>{fnr}</StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
    </StyledOppgaverContainer>
  </StyledResult>
);
