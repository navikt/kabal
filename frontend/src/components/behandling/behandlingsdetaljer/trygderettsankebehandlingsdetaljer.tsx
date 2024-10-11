import { GosysBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/beskrivelse';
import { PreviousSaksbehandler } from '@app/components/behandling/behandlingsdetaljer/previous-saksbehandler';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { ITrygderettsankebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading } from '@navikt/ds-react';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { KjennelseMottatt } from './kjennelse-mottatt';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SendtTilTrygderetten } from './sendt-til-trygderetten';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: ITrygderettsankebehandling;
}

export const Trygderettsankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();

  const { typeId, oppgavebeskrivelse, resultat, ytelseId, prosessfullmektig, saksnummer, id } = oppgavebehandling;

  const { utfallId, extraUtfallIdSet } = resultat;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <BehandlingSection label="Den ankende part">{oppgavebehandling.klager.name ?? 'Navn mangler'}</BehandlingSection>

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

      <BehandlingSection label="Ankebehandling fullført av">
        <PreviousSaksbehandler
          previousSaksbehandler={oppgavebehandling.previousSaksbehandler}
          type={SaksTypeEnum.ANKE_I_TRYGDERETTEN}
        />
      </BehandlingSection>

      <Saksnummer saksnummer={saksnummer} />

      <SendtTilTrygderetten />

      <KjennelseMottatt />

      <GosysBeskrivelse oppgavebeskrivelse={oppgavebeskrivelse} />

      <UtfallResultat utfall={utfallId} oppgaveId={id} extraUtfallIdSet={extraUtfallIdSet} typeId={typeId} />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
