import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { ForlengetBehandlingstid } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/forlenget-behandlingstid';
import { Gosys } from '@app/components/behandling/behandlingsdetaljer/gosys';
import { Klager } from '@app/components/behandling/behandlingsdetaljer/klager';
import { MottattDato } from '@app/components/behandling/behandlingsdetaljer/mottatt-klageinstans';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/gosys/beskrivelse/domain';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import { Fullmektig } from '@app/components/part/fullmektig/fullmektig';
import { Type } from '@app/components/type/type';
import { TRYGDERETTEN_ORGNR } from '@app/constants';
import { useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOmgjøringskravbehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading, VStack } from '@navikt/ds-react';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

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

        <VStack gap="4">
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
