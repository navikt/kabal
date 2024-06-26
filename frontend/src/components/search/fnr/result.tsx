import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { FeilregistrerteOppgaverTable } from '@app/components/search/common/feilregistrerte-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/search/common/oppgaver-paa-vent-table';
import { OppgaverPageWrapper } from '@app/pages/page-wrapper';
import { IPartBase } from '@app/types/oppgave-common';
import { IOppgaverResponse } from '@app/types/oppgaver';
import { CopyIdButton } from '../../copy-button/copy-id-button';
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
  <>
    <StyledPerson data-testid="search-result-person">
      <StyledName>{person.name}</StyledName>
      <StyledFnr>
        <CopyIdButton id={person.id} />
      </StyledFnr>
      <Button
        variant="secondary"
        size="small"
        onClick={footerProps.onRefresh}
        loading={footerProps.isLoading}
        icon={<MagnifyingGlassIcon aria-hidden />}
      >
        Søk på nytt
      </Button>
    </StyledPerson>
    <OppgaverPageWrapper testId="search-result">
      <LedigeOppgaverTable oppgaveIds={aapneBehandlinger} {...footerProps} />
      <OppgaverPaaVentTable oppgaveIds={paaVentBehandlinger} {...footerProps} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} {...footerProps} />
      <FeilregistrerteOppgaverTable oppgaveIds={feilregistrerteBehandlinger} {...footerProps} />
    </OppgaverPageWrapper>
  </>
);

const StyledPerson = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 16px;
  padding-left: 16px;
  padding-right: 16px;
`;
