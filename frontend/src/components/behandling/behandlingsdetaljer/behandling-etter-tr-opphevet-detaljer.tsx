import { VStack } from '@navikt/ds-react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { ExtraUtfall } from '@/components/behandling/behandlingsdetaljer/extra-utfall';
import { Gosys } from '@/components/behandling/behandlingsdetaljer/gosys';
import { Innsendingshjemmel } from '@/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { Klager } from '@/components/behandling/behandlingsdetaljer/klager';
import { Lovhjemmel } from '@/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from '@/components/behandling/behandlingsdetaljer/melding-fra-vedtaksinstans';
import { ReadOnlyDate } from '@/components/behandling/behandlingsdetaljer/read-only-date';
import { Saksnummer } from '@/components/behandling/behandlingsdetaljer/saksnummer';
import { Tilbakekreving } from '@/components/behandling/behandlingsdetaljer/tilbakekreving';
import { UtfallResultat } from '@/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@/components/behandling/styled-components';
import { BEHANDLING_PANEL_DOMAIN } from '@/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@/components/part/fullmektig/fullmektig';
import { Type } from '@/components/type/type';
import { TRYGDERETTEN_ORGNR } from '@/constants';
import { isoDateToPretty } from '@/domain/date';
import { useUpdateKlagerMutation } from '@/redux-api/oppgaver/mutations/behandling';
import type { IBehandlingEtterTryderettenOpphevet as IBehandlingEtterTrOpphevet } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgavebehandling: IBehandlingEtterTrOpphevet;
}

const DATE_ID = 'dato-for-kjennelse-mottatt-fra-trygderetten-med-utfall-opphevet';

export const BehandlingEtterTrOpphevetDetaljer = ({ oppgavebehandling }: Props) => {
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const {
    typeId,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    kommentarFraVedtaksinstans,
    resultat,
    ytelseId,
    prosessfullmektig,
    saksnummer,
    varsletFrist,
    kjennelseMottatt,
    id,
  } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <VStack gap="space-16">
          <Klager
            klager={oppgavebehandling.klager}
            onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
            isLoading={klagerIsLoading}
            invalidReceivers={[
              {
                id: TRYGDERETTEN_ORGNR,
                message: 'Trygderetten kan ikke settes som opprinnelig klager / ankende part.',
              },
            ]}
            typeId={typeId}
          />

          <Fullmektig part={prosessfullmektig} />

          <BehandlingSection label="Type">
            <Type type={typeId} />
          </BehandlingSection>

          <BehandlingSection label="Ytelse">
            <Ytelse ytelseId={ytelseId} />
          </BehandlingSection>

          <Saksnummer saksnummer={saksnummer} />

          <Innsendingshjemmel oppgavebehandling={oppgavebehandling} />

          <ReadOnlyDate
            date={kjennelseMottatt}
            id={DATE_ID}
            label="Dato for kjennelse mottatt fra Trygderetten med utfall opphevet"
          />

          <BehandlingSection label="Varslet frist">
            {varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}
          </BehandlingSection>

          <BehandlingSection label="Anke behandlet av">
            {fraNAVEnhetNavn} - {fraNAVEnhet}
          </BehandlingSection>

          <MeldingFraVedtaksinstans kommentarFraVedtaksinstans={kommentarFraVedtaksinstans} />

          <Gosys oppgavebehandling={oppgavebehandling} />

          <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

          <ExtraUtfall utfallIdSet={extraUtfallIdSet} mainUtfall={utfallId} oppgaveId={id} typeId={typeId} />

          <Lovhjemmel />

          <Tilbakekreving />
        </VStack>
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
