import { Heading } from '@navikt/ds-react';
import React from 'react';
import { EventHistory } from '@app/components/behandling/behandlingsdialog/history/history';
import { Rol } from '@app/components/behandling/behandlingsdialog/rol/rol';
import { Saksbehandler } from '@app/components/behandling/behandlingsdialog/saksbehandler';
import { StyledBehandlingSection } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

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
