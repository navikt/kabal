import React from 'react';
import { styled } from 'styled-components';
import { FeilregistrerteOppgaverTable } from '@app/components/search/common/feilregistrerte-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/search/common/oppgaver-paa-vent-table';
import { OppgaverPageWrapper } from '@app/pages/page-wrapper';
import { IPartBase } from '@app/types/oppgave-common';
import { IOppgaverResponse } from '@app/types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { LedigeOppgaverTable } from '../common/ledige-oppgaver-table';
import { StyledFnr, StyledName } from '../common/styled-components';

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
  <div data-testid="search-result">
    <StyledPerson>
      <StyledName>{person.name}</StyledName>
      <StyledFnr>
        <CopyFnrButton fnr={person.id} />
      </StyledFnr>
    </StyledPerson>
    <OppgaverPageWrapper>
      <LedigeOppgaverTable oppgaveIds={aapneBehandlinger} {...footerProps} />
      <OppgaverPaaVentTable oppgaveIds={paaVentBehandlinger} {...footerProps} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} {...footerProps} />
      <FeilregistrerteOppgaverTable oppgaveIds={feilregistrerteBehandlinger} {...footerProps} />
    </OppgaverPageWrapper>
  </div>
);

const StyledPerson = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 16px;
  padding-left: 16px;
  padding-right: 16px;
`;
