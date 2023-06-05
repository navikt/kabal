import React from 'react';
import { FeilregistrerteOppgaverTable } from '@app/components/search/common/feilregistrerte-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/search/common/oppgaver-paa-vent-table';
import { IPartBase } from '@app/types/oppgave-common';
import { IOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { LedigeOppgaverTable } from '../common/ledige-oppgaver-table';
import { StyledFnr, StyledFnrResult, StyledName, StyledOppgaverContainer } from '../common/styled-components';

interface Props extends IOppgaverResponse {
  person: IPartBase;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Result = ({
  person,
  aapneBehandlinger,
  avsluttedeBehandlinger,
  feilregistrerteBehandlinger,
  paaVentBehandlinger,
  ...footerProps
}: Props) => (
  <StyledFnrResult key={person.id} data-testid="search-result">
    <StyledName>{person.name}</StyledName>
    <StyledFnr>
      <CopyFnrButton fnr={person.id} />
    </StyledFnr>
    <StyledOppgaverContainer>
      <LedigeOppgaverTable oppgaveIds={aapneBehandlinger} {...footerProps} />
      <OppgaverPaaVentTable oppgaveIds={paaVentBehandlinger} {...footerProps} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} {...footerProps} />
      <FeilregistrerteOppgaverTable oppgaveIds={feilregistrerteBehandlinger} {...footerProps} />
    </StyledOppgaverContainer>
  </StyledFnrResult>
);
