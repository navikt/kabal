import { Heading, Skeleton } from '@navikt/ds-react';
import React from 'react';
import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useBehandlingEnabled } from '@app/hooks/settings/use-setting';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { Ankebehandlingsdetaljer } from './behandlingsdetaljer/ankebehandlingsdetaljer';
import { Klagebehandlingsdetaljer } from './behandlingsdetaljer/klagebehandlingsdetaljer';
import { Trygderettsankebehandlingsdetaljer } from './behandlingsdetaljer/trygderettsankebehandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledBehandlingSection, StyledContainer } from './styled-components';

export const Behandling = () => {
  const { value: shown = true } = useBehandlingEnabled();

  if (!shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="behandling-panel">
      <StyledContainer>
        <Behandlingsdetaljer />
        <Behandlingsdialog />
      </StyledContainer>
    </PanelContainer>
  );
};

const Behandlingsdetaljer = () => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return (
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <BehandlingSection label="Klager">
          <Skeleton variant="text" height={34} />
          <Skeleton variant="rounded" height={20} width={100} />
        </BehandlingSection>

        <BehandlingSection label="Fullmektig">
          <Skeleton variant="text" height={34} />
          <Skeleton variant="rounded" height={20} width={100} />
        </BehandlingSection>

        <BehandlingSection label="Type">
          <Skeleton variant="rounded" height={28} width={55} />
        </BehandlingSection>

        <BehandlingSection label="Ytelse">
          <Skeleton variant="rounded" height={28} width={150} />
        </BehandlingSection>

        <BehandlingSection label="Utfall/resultat">
          <Skeleton variant="rounded" height={32} />
        </BehandlingSection>

        <BehandlingSection label="Utfallet er basert på lovhjemmel">
          <Skeleton variant="rounded" height={32} />
          <Skeleton variant="text" height={70} />
        </BehandlingSection>
      </StyledBehandlingSection>
    );
  }

  if (oppgave.typeId === SaksTypeEnum.KLAGE) {
    return <Klagebehandlingsdetaljer oppgavebehandling={oppgave} />;
  }

  if (oppgave.typeId === SaksTypeEnum.ANKE) {
    return <Ankebehandlingsdetaljer oppgavebehandling={oppgave} />;
  }

  return <Trygderettsankebehandlingsdetaljer oppgavebehandling={oppgave} />;
};
