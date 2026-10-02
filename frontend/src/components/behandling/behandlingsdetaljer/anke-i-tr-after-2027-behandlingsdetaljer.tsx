import { VStack } from '@navikt/ds-react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { Gosys } from '@/components/behandling/behandlingsdetaljer/gosys';
import { Innsendingshjemmel } from '@/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { KjennelseMottatt } from '@/components/behandling/behandlingsdetaljer/kjennelse-mottatt';
import { OrgWarning } from '@/components/behandling/behandlingsdetaljer/klager';
import { Lovhjemmel } from '@/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { PreviousSaksbehandler } from '@/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@/components/behandling/behandlingsdetaljer/saksnummer';
import { SaksnummerHosTrygderetten } from '@/components/behandling/behandlingsdetaljer/saksnummer-hos-tr';
import { SendtTilTrygderetten } from '@/components/behandling/behandlingsdetaljer/sendt-til-trygderetten';
import { Tilbakekreving } from '@/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@/components/behandling/styled-components';
import { BEHANDLING_PANEL_DOMAIN } from '@/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@/components/part/fullmektig/fullmektig';
import { Type } from '@/components/type/type';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IAnkeITRAfter2027Behandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgavebehandling: IAnkeITRAfter2027Behandling;
}

export const AnkeITRAfter2027Behandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const {
    typeId,
    resultat,
    ytelseId,
    prosessfullmektig,
    saksnummer,
    id,
    trygderettenSaksnummer: saksnummerHosTrygderetten,
  } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <VStack gap="space-16">
          <BehandlingSection label="Den ankende part">
            <VStack gap="space-8">
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

          <PreviousSaksbehandler
            previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
            type={SaksTypeEnum.ANKE_I_TRYGDERETTEN}
          />

          <Saksnummer saksnummer={saksnummer} />

          <SaksnummerHosTrygderetten saksnummer={saksnummerHosTrygderetten} />

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
