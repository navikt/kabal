import React from 'react';
import { getFullName } from '@app/domain/name';
import { IPersonAndOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledFnr, StyledFnrResult, StyledName, StyledOppgaverContainer } from '../common/styled-components';

export const Result = ({ fnr, navn, aapneBehandlinger, avsluttedeBehandlinger }: IPersonAndOppgaverResponse) => (
  <StyledFnrResult key={fnr} data-testid="search-result">
    <StyledName>{getFullName(navn)}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={fnr} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable oppgaveIds={aapneBehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeBehandlinger} />
    </StyledOppgaverContainer>
  </StyledFnrResult>
);
