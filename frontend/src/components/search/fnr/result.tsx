import React from 'react';
import { getFullName } from '@app/domain/name';
import { IPersonAndOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledFnr, StyledName, StyledOppgaverContainer, StyledResult } from '../common/styled-components';

export const Result = ({ fnr, navn, aapneBehandlinger, avsluttedeBehandlinger }: IPersonAndOppgaverResponse) => (
  <StyledResult key={fnr} data-testid="search-result">
    <StyledName>{getFullName(navn)}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={fnr} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable activeOppgaver={aapneBehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeBehandlinger} />
    </StyledOppgaverContainer>
  </StyledResult>
);
