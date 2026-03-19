import { Heading, Skeleton } from '@navikt/ds-react';
import { Ankebehandlingsdetaljer } from '@/components/behandling/behandlingsdetaljer/ankebehandlingsdetaljer';
import { BegjæringOmGjenopptakDetaljer } from '@/components/behandling/behandlingsdetaljer/begjæring-om-gjenopptak-detaljer';
import { BegjæringOmGjenopptakITrDetaljer } from '@/components/behandling/behandlingsdetaljer/begjæring-om-gjenopptak-i-tr-detaljer';
import { BehandlingEtterTrOpphevetDetaljer } from '@/components/behandling/behandlingsdetaljer/behandling-etter-tr-opphevet-detaljer';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { Klagebehandlingsdetaljer } from '@/components/behandling/behandlingsdetaljer/klagebehandlingsdetaljer';
import { Omgjøringskravdetaljer } from '@/components/behandling/behandlingsdetaljer/omgjøringskravdetaljer';
import { Trygderettsankebehandlingsdetaljer } from '@/components/behandling/behandlingsdetaljer/trygderettsankebehandlingsdetaljer';
import { StyledBehandlingSection } from '@/components/behandling/styled-components';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@/types/kodeverk';

export const Behandlingsdetaljer = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
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

  switch (oppgave.typeId) {
    case SaksTypeEnum.KLAGE:
      return <Klagebehandlingsdetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.ANKE:
      return <Ankebehandlingsdetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return <Trygderettsankebehandlingsdetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return <BehandlingEtterTrOpphevetDetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return <Omgjøringskravdetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return <BegjæringOmGjenopptakDetaljer oppgavebehandling={oppgave} />;
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return <BegjæringOmGjenopptakITrDetaljer oppgavebehandling={oppgave} />;
  }
};
