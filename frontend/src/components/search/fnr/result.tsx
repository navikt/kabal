import React from 'react';
import { IPersonAndOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledFnr, StyledFnrResult, StyledName, StyledOppgaverContainer } from '../common/styled-components';

export const Result = ({ id, name, aapneBehandlinger, avsluttedeBehandlinger }: IPersonAndOppgaverResponse) => (
  <StyledFnrResult key={id} data-testid="search-result">
    <StyledName>{name}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={id} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable oppgaveIds={aapneBehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeBehandlinger} />
    </StyledOppgaverContainer>
  </StyledFnrResult>
);
