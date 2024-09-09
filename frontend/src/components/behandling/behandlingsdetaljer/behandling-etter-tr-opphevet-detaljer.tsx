import { Heading } from '@navikt/ds-react';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { GosysBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/beskrivelse';
import { ReadOnlyDate } from '@app/components/behandling/behandlingsdetaljer/read-only-date';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { IBehandlingEtterTryderettenOpphevet as IBehandlingEtterTrOpphevet } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Part } from '../../part/part';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from './melding-fra-vedtaksinstans';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IBehandlingEtterTrOpphevet;
}

export const BehandlingEtterTrOpphevetDetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const {
    typeId,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraVedtaksinstans,
    oppgavebeskrivelse,
    resultat,
    ytelseId,
    prosessfullmektig,
    saksnummer,
    varsletFrist,
    kjennelseMottatt,
    created,
  } = oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <Part
        isDeletable={false}
        label="Opprinnelig klager / ankende part"
        part={oppgavebehandling.klager}
        onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
        isLoading={klagerIsLoading}
      />

      <Part
        isDeletable
        label="Fullmektig"
        part={prosessfullmektig}
        onChange={(fullmektig) => updateFullmektig({ fullmektig, oppgaveId: oppgavebehandling.id })}
        isLoading={fullmektigIsLoading}
      />

      <BehandlingSection label="Type">
        <Type type={typeId} />
      </BehandlingSection>

      <BehandlingSection label="Ytelse">
        <Ytelse ytelseId={ytelseId} />
      </BehandlingSection>

      <Saksnummer saksnummer={saksnummer} />

      <ReadOnlyDate
        date={kjennelseMottatt}
        id="dato-for-kjennelse-fra-trygderetten-med-utfall-opphevet"
        label="Dato for kjennelse fra Trygderetten med utfall opphevet"
      />

      <ReadOnlyDate
        date={mottattKlageinstans}
        id="dato-for-kjennelse-mottatt-klageinstans"
        label="Dato for kjennelse mottatt klageinstans"
      />

      <ReadOnlyDate
        date={created}
        id="dato-for-ny-behandling-opprettet-i-kabal"
        label="Dato for ny behandling opprettet i Kabal"
      />

      <BehandlingSection label="Varslet frist">
        {varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}
      </BehandlingSection>

      <BehandlingSection label="Anke behandlet av">
        {fraNAVEnhetNavn} - {fraNAVEnhet}
      </BehandlingSection>

      <MeldingFraVedtaksinstans kommentarFraVedtaksinstans={kommentarFraVedtaksinstans} />

      <GosysBeskrivelse oppgavebeskrivelse={oppgavebeskrivelse} />

      <UtfallResultat utfall={resultat.utfallId} oppgaveId={oppgavebehandling.id} />

      <ExtraUtfall
        utfallIdSet={resultat.extraUtfallIdSet}
        mainUtfall={resultat.utfallId}
        oppgaveId={oppgavebehandling.id}
      />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};