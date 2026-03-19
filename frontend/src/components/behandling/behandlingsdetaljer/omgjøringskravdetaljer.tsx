import { Heading, VStack } from '@navikt/ds-react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { ExtraUtfall } from '@/components/behandling/behandlingsdetaljer/extra-utfall';
import { ForlengetBehandlingstid } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/forlenget-behandlingstid';
import { Gosys } from '@/components/behandling/behandlingsdetaljer/gosys';
import { Klager } from '@/components/behandling/behandlingsdetaljer/klager';
import { Lovhjemmel } from '@/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel';
import { MottattDato } from '@/components/behandling/behandlingsdetaljer/mottatt-klageinstans';
import { PreviousSaksbehandler } from '@/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@/components/behandling/behandlingsdetaljer/saksnummer';
import { UtfallResultat } from '@/components/behandling/behandlingsdetaljer/utfall-resultat';
import { Ytelse } from '@/components/behandling/behandlingsdetaljer/ytelse';
import { StyledBehandlingSection } from '@/components/behandling/styled-components';
import { BEHANDLING_PANEL_DOMAIN } from '@/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@/components/part/fullmektig/fullmektig';
import { Type } from '@/components/type/type';
import { TRYGDERETTEN_ORGNR } from '@/constants';
import { useUpdateKlagerMutation } from '@/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IOmgjøringskravbehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgavebehandling: IOmgjøringskravbehandling;
}

export const Omgjøringskravdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId, prosessfullmektig, saksnummer, id } =
    oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <GrafanaDomainProvider domain={BEHANDLING_PANEL_DOMAIN}>
      <StyledBehandlingSection>
        <Heading level="1" size="medium" spacing>
          Behandling
        </Heading>

        <VStack gap="space-16">
          <Klager
            klager={oppgavebehandling.klager}
            onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
            isLoading={klagerIsLoading}
            invalidReceivers={[
              {
                id: TRYGDERETTEN_ORGNR,
                message: 'Trygderetten kan ikke settes som den som krever omgjøring.',
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

          <PreviousSaksbehandler
            previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
            type={SaksTypeEnum.OMGJØRINGSKRAV}
          />

          <Saksnummer saksnummer={saksnummer} />

          <ForlengetBehandlingstid oppgavebehandling={oppgavebehandling}>
            <MottattDato />
          </ForlengetBehandlingstid>

          <BehandlingSection label="Behandlet av">
            {fraNAVEnhetNavn} - {fraNAVEnhet}
          </BehandlingSection>

          <MottattDato />

          <Gosys oppgavebehandling={oppgavebehandling} />

          <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

          <ExtraUtfall utfallIdSet={extraUtfallIdSet} mainUtfall={utfallId} oppgaveId={id} typeId={typeId} />

          <Lovhjemmel />
        </VStack>
      </StyledBehandlingSection>
    </GrafanaDomainProvider>
  );
};
