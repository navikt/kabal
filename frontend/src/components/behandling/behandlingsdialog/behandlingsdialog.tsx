import { EventHistory } from '@app/components/behandling/behandlingsdialog/history/history';
import { Messages } from '@app/components/behandling/behandlingsdialog/messages/messages';
import { Rol } from '@app/components/behandling/behandlingsdialog/rol/rol';
import { Saksbehandler } from '@app/components/behandling/behandlingsdialog/saksbehandler';
import { Heading } from '@navikt/ds-react';
import { StyledBehandlingSection } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';

export const Behandlingsdialog = () => (
  <StyledBehandlingSection>
    <Heading level="1" size="medium" spacing>
      Behandlingsdialog
    </Heading>
    <Saksbehandler />
    <Medunderskriver />
    <Rol />
    <Messages />
    <hr />
    <EventHistory />
  </StyledBehandlingSection>
);
