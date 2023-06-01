import React from 'react';
import { IPartBase } from '@app/types/oppgave-common';
import { IOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledFnr, StyledFnrResult, StyledName, StyledOppgaverContainer } from '../common/styled-components';

interface Props extends IOppgaverResponse {
  person: IPartBase;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Result = ({ person, aapneBehandlinger, avsluttedeBehandlinger, ...footerProps }: Props) => (
  <StyledFnrResult key={person.id} data-testid="search-result">
    <StyledName>{person.name}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={person.id} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <ActiveOppgaverTable oppgaveIds={aapneBehandlinger} {...footerProps} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} {...footerProps} />
    </StyledOppgaverContainer>
  </StyledFnrResult>
);
