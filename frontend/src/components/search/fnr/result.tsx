import React from 'react';
import { getFullName } from '../../../domain/name';
import { IPersonAndOppgaverResponse } from '../../../types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledFnr, StyledName, StyledOppgaverContainer, StyledResult } from '../common/styled-components';

export const Result = ({
  fnr,
  navn,
  aapneKlagebehandlinger,
  avsluttedeKlagebehandlinger,
}: IPersonAndOppgaverResponse) => (
  <StyledResult key={fnr} data-testid="search-result">
    <StyledName>{getFullName(navn)}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={fnr} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
    </StyledOppgaverContainer>
  </StyledResult>
);
