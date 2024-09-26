import { Heading } from '@navikt/ds-react';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { GosysBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/beskrivelse';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { isoDateToPretty } from '@app/domain/date';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { AnkeMottattDato } from './anke-mottatt-dato';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Ankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const {
    typeId,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    oppgavebeskrivelse,
    resultat,
    ytelseId,
    prosessfullmektig,
    saksnummer,
    varsletFrist,
  } = oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <Part
        isDeletable={false}
        label="Den ankende part"
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

      <BehandlingSection label="Klagebehandling fullført av">
        <PreviousSaksbehandler
          previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
          type={SaksTypeEnum.ANKE}
        />
      </BehandlingSection>

      <Saksnummer saksnummer={saksnummer} />

      <BehandlingSection label="Varslet frist">
        {varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}
      </BehandlingSection>

      <BehandlingSection label="Behandlet av">
        {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
      </BehandlingSection>

      <AnkeMottattDato />

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
