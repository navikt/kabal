import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Gosys } from '@app/components/behandling/behandlingsdetaljer/gosys';
import { Innsendingshjemmel } from '@app/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { KjennelseMottatt } from '@app/components/behandling/behandlingsdetaljer/kjennelse-mottatt';
import { OrgWarning } from '@app/components/behandling/behandlingsdetaljer/klager';
import { Lovhjemmel } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { SendtTilTrygderetten } from '@app/components/behandling/behandlingsdetaljer/sendt-til-trygderetten';
import { Tilbakekreving } from '@app/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@app/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@app/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@app/components/behandling/styled-components';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@app/components/part/fullmektig/fullmektig';
import { Type } from '@app/components/type/type';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { ITrygderettsankebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading, VStack } from '@navikt/ds-react';

interface Props {
  oppgavebehandling: ITrygderettsankebehandling;
}

export const Trygderettsankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const { typeId, resultat, ytelseId, prosessfullmektig, saksnummer, id } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>
        <VStack gap="4">
          <BehandlingSection label="Den ankende part">
            <VStack gap="2">
              {oppgavebehandling.klager.name ?? 'Navn mangler'}
              <OrgWarning identifikator={oppgavebehandling.klager.identifikator} label="ankende part" />
            </VStack>
          </BehandlingSection>

          <Fullmektig part={prosessfullmektig} />

          <BehandlingSection label="Type">
            <Type type={typeId} />
          </BehandlingSection>

          <BehandlingSection label="Ytelse">
            <Ytelse ytelseId={ytelseId} />
          </BehandlingSection>

          <BehandlingSection label="Ankebehandling fullført av">
            <PreviousSaksbehandler
              previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
              type={SaksTypeEnum.ANKE_I_TRYGDERETTEN}
            />
          </BehandlingSection>

          <Saksnummer saksnummer={saksnummer} />

          <Innsendingshjemmel oppgavebehandling={oppgavebehandling} />

          <SendtTilTrygderetten />

          <KjennelseMottatt />

          <Gosys oppgavebehandling={oppgavebehandling} />

          <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

          <Lovhjemmel />

          <Tilbakekreving />
        </VStack>
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
